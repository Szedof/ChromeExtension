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

// chrome.webNavigation.onCommitted.addListener((info) => {
//     if(info.transitionType == "reload" && options.btnPath != "") {
//         clickBtn(tabID, options.btnPath, options.btnClickTime);
//     }
// });

const refresh = (id) => {
    ref = setInterval(() => {
//         clickBtn(tabID, options.btnPath, options.btnClickTime)
        chrome.webNavigation.onCommitted.addListener((info) => {
            if(info.transitionType == "reload" && options.btnPath != "") {
                clickBtn(tabID, options.btnPath, options.btnClickTime);
            }
        });
        chrome.tabs.reload(id)
    }, options.webRefreshTime);
}

const stopRef = () => {
    clearInterval(ref)
}

const clickBtn = (id, path, timer) => {
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
            setInterval(() => {
                element.click()
            }, arg2)
        }
    })
}
