function renderText (selector, text) {
    const element = document.querySelector(`#${selector}`)
    let json = JSON.stringify(text, null, 2)
    // After the `text` stringify, the JSON string is enclosed in double quotation marks
    if (typeof text === 'string') {
        json = text
    }
    if (element) element.innerHTML = '<pre>' + json + '</pre>';
}

function renderNet (msg) {
    if(msg) {
        document.querySelector('#netStatus').classList.add('on')
    } else {
        document.querySelector('#netStatus').classList.remove('on')
    }
}

export {
    renderText,
    renderNet
}
