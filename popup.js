const body = document.querySelector("body");
const rstBtn = body.querySelector('button[name="reset"]');
const thmBtn = body.querySelector('button[name="theme"]');
const thmIcon = thmBtn.querySelector("img");

let theme;
browser.storage.local.get("theme").then((item) => {
    if(item.hasOwnProperty("theme"))
        theme = item.theme;
    else {
        theme = "light";
        browser.storage.local.set({theme});
    }
    thmIcon.src = theme === "light"?"./img/light.png":"./img/dark.png";
    if(theme === "light") {
        body.classList.remove("dark");
        rstBtn.classList.remove("dark");
        thmBtn.classList.remove("dark");
    }
    else {
        body.classList.add("dark");
        rstBtn.classList.add("dark");
        thmBtn.classList.add("dark");
    }
})

browser.runtime.getBackgroundPage().then((background) => {
    background.update();
    const dataArray = Object.keys(background.data).map((key) => [key, background.data[key]]);
    dataArray.sort((a, b) => b[1] - a[1]);
    for(let i = 0; i < dataArray.length && i < 10; i++) {
        const domain = document.createElement("div");
        const duration = document.createElement("div");
        const container = document.createElement("div");
        container.className = "entry";
        domain.textContent = dataArray[i][0];
        let tempDuration = dataArray[i][1];
        const min = Math.trunc(tempDuration / 60000);
        const hrs = Math.trunc(tempDuration / 3600000);
        duration.textContent = `${hrs}h ${min}m`;
        container.appendChild(domain);
        container.appendChild(duration);
        body.appendChild(container);
    }
});

rstBtn.addEventListener("click", () => {
    browser.runtime.getBackgroundPage().then((background) => {
        background.reset();
        window.close();
    })
})

thmBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    rstBtn.classList.toggle("dark");
    thmBtn.classList.toggle("dark");
    theme = theme === "light"?"dark":"light";
    thmIcon.src = theme === "light"?"./img/light.png":"./img/dark.png";
    browser.storage.local.set({theme});
})