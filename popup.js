function onGot(tabInfo) {
    console.log(tabInfo);
  }
  
  function onError(error) {
    console.log(`Error: ${error}`);
  }
  
  const gettingCurrent = browser.tabs.getCurrent();
  gettingCurrent.then(onGot, onError);