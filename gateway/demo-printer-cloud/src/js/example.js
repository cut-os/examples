
const replaceTextById = (selector, text) => {
    const element = document.querySelector(`#${selector}`)
    if (element) element.innerText = JSON.stringify(text, null, '\t')
}

function renderText (selector, content) {
    replaceTextById(`${selector}-text`, content)
}

function renderNet (msg) {
    if(msg) {
        document.querySelector('#netStatus').classList.add('on')
    } else {
        document.querySelector('#netStatus').classList.remove('on')
    }
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
function renderMessage(name, text) {
    const parentElement = document.querySelector('.msg-panel');
    const newElement = document.createElement('div');
    newElement.classList.add('msg-row');
    newElement.classList.add('fade-in');
    newElement.classList.add(name);
    newElement.innerText = `${name}: ${text}`;
    parentElement.insertBefore(newElement, parentElement.firstChild);
}

export {
    renderText,
    renderNet,
    modalShow,
    modalHide,
    renderMessage
}
