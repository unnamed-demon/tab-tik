const data = new Map();

let browserActive;

const add = () => {browser.tabs.query({status: "complete", active: true}).then(getTab)};

const show = () => {
    for (const [key, value] of data) {
        console.log(`${key} => ${value}`);
    }
}

const prevDomain = {
    domain: null,
    startTime: null
}

const getTab = (activeTab) => {
    if(activeTab.length === 0 || !browserActive)
        return;
    const urlObj = new URL(activeTab[0].url);
    if(urlObj.hostname === '')
        return;
    prevDomain.domain = urlObj.hostname;
    prevDomain.startTime = Date.now();
}

const update = () => {
    if(prevDomain.domain !== null) {
        data.set(prevDomain.domain, (data.has(prevDomain.domain)?data.get(prevDomain.domain):0) + Date.now() - prevDomain.startTime);
        prevDomain.domain = null;
    }
    browser.tabs.query({status: "complete", active: true, lastFocusedWindow: true}).then(getTab);
}

const focusCheck = id => {
    if(id === browser.windows.WINDOW_ID_NONE)
        browserActive = false;
    else
        browserActive = true;
    update();
}

setInterval(update, 60000);
browser.tabs.onUpdated.addListener(update);
browser.tabs.onActivated.addListener(update);
browser.windows.onFocusChanged.addListener(focusCheck);