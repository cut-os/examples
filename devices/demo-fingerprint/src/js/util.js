function renderText(selector, text) {
    const element = document.querySelector(`#${selector}`)
    let json = JSON.stringify(text, null, 2)
    // After the `text` stringify, the JSON string is enclosed in double quotation marks
    if (typeof text === 'string') {
        json = text
    }
    if (element) element.innerHTML = '<pre>' + json + '</pre>';
}

function renderNet(msg) {
    if (msg) {
        document.querySelector('#netStatus').classList.add('on')
    } else {
        document.querySelector('#netStatus').classList.remove('on')
    }
}

function toastShow(text) {
    let toast = document.querySelector('#toast')
    let content = document.querySelector('#toast-text')

    content.innerText = text
    toast.style.animation = 'fadeIn 200ms linear forwards'

    setTimeout(() => {
        toast.style.animation = 'fadeOut 500ms linear forwards'
    }, 1000)
}

function modalShow() {
    let modal = document.querySelector("#mask");
    modal.classList.remove('active');
    modal.classList.add('active');
}

function modalHide() {
    let modal = document.querySelector("#mask");
    modal.classList.remove('active');
}

export {
    renderText,
    renderNet,
    modalShow,
    modalHide,
    toastShow
}
