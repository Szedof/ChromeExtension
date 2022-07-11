console.log("From foreground")

const inputUrl = document.querySelector(".inputUrl");
const inputRef = document.querySelector(".inputRef");
const inputPathBtn = document.querySelector(".inputPathButton");
const inputClick = document.querySelector(".inputClick");
const startBtn = document.querySelector(".startBtn");
const stopBtn = document.querySelector(".stopBtn");

startBtn.addEventListener("click", () => {
    chrome.tabs.query({url: `${inputUrl.value}/*`}, (tab) => {

        chrome.storage.local.set({"tabIDStorage": tab[0].id}, () => {
            console.log(`${tab[0].id} set to local`)
        })
        
        chrome.runtime.sendMessage(
            { 
                tabIDMessage: tab[0].id,
                options: {
                    url: inputUrl.value,
                    webRefreshTime: parseInt(inputRef.value),
                    btnPath: inputPathBtn.value,
                    btnClickTime: parseInt(inputClick.value),
                },
                message: "start"
            }
        );
    })
})

stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({message: "stop"});
})
