const body = document.querySelector("body");

browser.runtime.getBackgroundPage().then((background) => {
    background.update();
    const dataArray = Object.keys(background.data).map((key) => [key, background.data[key]]);
    dataArray.sort((a, b) => b[1] - a[1]);
    for(let i = 0; i < dataArray.length && i < 10; i++) {
        const domain = document.createElement("div");
        const duration = document.createElement("div");
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.justifyContent = "space-between";
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

const btn = body.querySelector("button");
btn.addEventListener("click", () => {
    browser.runtime.getBackgroundPage().then((background) => {
        background.reset();
        window.close();
    })
})