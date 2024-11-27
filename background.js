var data;
browser.storage.local.get("data").then((item) => data = (item.hasOwnProperty("data")?item.data:{}))

let browserActive;

const add = () => {browser.tabs.query({status: "complete", active: true}).then(getTab)};

const show = () => console.log(data)

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
    if(urlObj.hostname.slice(0, 4) === "www.")
        urlObj.hostname = urlObj.hostname.slice(4);
    prevDomain.domain = urlObj.hostname;
    prevDomain.startTime = Date.now();
}

var update = () => {
    if(prevDomain.domain !== null) {
        data[prevDomain.domain] = (data.hasOwnProperty(prevDomain.domain)?data[prevDomain.domain]:0) + Date.now() - prevDomain.startTime;
        browser.storage.local.set({data});
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