import {DeviceIDCardReader} from '@cutos/devices'
import {config} from "./js/config";
import {renderNet, modalShow, modalHide, renderText} from './js/util';
import {CoreAPI} from "@cutos/core";
import './style/init.css'

const lwaInfo = ['name', 'version', 'description'];
// host is CUTOS IP address the default value is localhost,
// which can be modified to the target address during development，eg：192.168.1.11.
const host = '';


let device = null
let timer = null
let times = 3;

function onDeviceCreate(result, error) {
    if (!error) {
        device.connect(onDeviceConnect)
        device.onData(onDeviceData)
    } else {
        console.log(error)
    }
}

function onDeviceConnect(result) {
    if (result.status) {
        device.readDeviceInfo(info => renderText('info-text', info))
        device.startRead(result => console.log(result))
    } else {
        console.log(result.msg)
    }
}

function onDeviceData(data) {
    showDeviceData(data)
    modalShow()
    countDown()
}

function showLWAInfo() {
    let info = {}
    for (let key of lwaInfo) {
        info[key] = config[key]
    }
    renderText('lwa-info-text', info)
    renderText('params-text', config.params.title)
}


function showDeviceData(data) {
    for (let key in data.values) {
        let element = document.getElementById('text-' + key)
        if (element) {
            element.innerText = data.values[key]
        }
    }

    let avatar = document.getElementById('avatar')
    avatar.style.display = 'block'
    if (!data.values['base64BMPData']) {
        avatar.style.display = 'none'
    }else {
        avatar.src = data.values['base64BMPData']
    }
}


function countDown() {
    if (timer) return;
    timer = setInterval(() => {
        if (--times <= 0) {
            times = 3;
            renderText("count_down_text", `3 秒后关闭窗口`)
            modalHide();
            clearInterval(timer);
            device.startRead()
            timer = null;
        } else {
            renderText("count_down_text", `${times} 秒后关闭窗口`)
        }
    }, 1000)
}


function lwaStart() {
    showLWAInfo()
    CoreAPI.init(host, (result, error) => {
        if (!error) {
            renderNet(true);
            device = new DeviceIDCardReader();
            device.init(onDeviceCreate);
        } else {
            console.log(error)
        }
    })
}

lwaStart()



