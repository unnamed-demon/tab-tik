const data = new Map();

const entry = {
    domain: null,
    startingTime: null,
    setDomain: (domainName) => this.domain = domainName,
    timeSetter: () => this.startingTime = Date.now(),
    reset: () => this.domain = null
}

const getTab = (activeTab) => {
    const urlObj = new URL(activeTab[0].url);
    if(urlObj.hostname == '')
        return;
    entry.setDomain(urlObj.hostname);
    entry.timeSetter();
}

const add = () => {browser.tabs.query({active: true}).then(getTab)};
const show = () => {
    for (const [key, value] of data) {
        console.log(`${key} => ${value}`);
    }
}

const update = () => {
    if(entry.domain !== null) {
        data.set(entry.domain, (data.has(entry.domain)?data.get(entry.domain):0) + Date.now() - entry.startingTime);
        entry.reset();
    }
    browser.tabs.query({status: "complete", active: true}).then(getTab);
}

browser.tabs.onUpdated.addListener(update);
browser.tabs.onActivated.addListener(update);
setInterval(update, 60000);
