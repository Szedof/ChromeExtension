console.log("From background");
let tabID = 0
let ref = null;
let options = {}

chrome.runtime.onMessage.addListener(request => {
    tabID = request.tabIDMessage;
    options = request.options;
    console.log(tabID)
    if(request.message == "start"){
        refresh(tabID, options.webRefreshTime)
        clickBtn(tabID, options.btnPath, options.btnClickTime)
    } else {
        stopRef()
    }
})

chrome.webNavigation.onCommitted.addListener((info) => {
    if(info.transitionType == "reload") {
        clickBtn(tabID, options.btnPath, options.btnClickTime);
    }
});

const refresh = (id) => {
    ref = setInterval(() => {
        chrome.tabs.reload(id)
    }, options.webRefreshTime);
}

const stopRef = () => {
    clearInterval(ref)
    options = {}
    chrome.storage.local.get(["tabIDStorage"], (value) => {
        chrome.scripting.executeScript({
            target: { tabId: value.tabIDStorage },
            func: () => {
                let item = localStorage.getItem("IntervalID")
                clearInterval(item)
            }
        })
    })
}

const clickBtn = (id, path, timer) => {
    if(Object.keys(options).length != 0) {
        chrome.scripting.executeScript(
            {
            args: [path, timer],
            target: { tabId: id },
            func: (arg1,  arg2) => {
                let element = document.evaluate(
                    arg1,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null,
                ).singleNodeValue
                console.log("Timer")
                
                let interval = setInterval(() => {
                    element.click()
                }, arg2)
                // console.log(`Interval ID: ${interval}`)
                localStorage.setItem("IntervalID", interval)
            }
        })
    }
}
