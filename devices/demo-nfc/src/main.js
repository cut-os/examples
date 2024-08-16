import {CoreAPI} from "@cutos/core";
import {DeviceNFC} from "@cutos/devices";
import {config} from "./js/config";
import {renderNet, renderText} from './js/util';
import "./js/cutos-devices-async";
import './style/init.css'


// host is CUTOS IP address the default value is localhost,
// which can be modified to the target address during development，eg：192.168.1.11.
const host = null;


function showLWAInfo() {
    let lwaInfo = ['name', 'version', 'description'];
    let info = {}
    for (let key of lwaInfo) {
        info[key] = config[key]
    }
    renderText('lwa-info-text', info)
    renderText('params-text', config.params.title)
}

async function lwaStart() {
    showLWAInfo()
    await CoreAPI.initAsync(host)
    renderNet(true)
    const device = new DeviceNFC()
    await device.initAsync()
    await device.connectAsync('/dev/ttyS8')
    device.onData(data => {
        renderText('info-text', data)
    })
}

try {
    await lwaStart()
} catch (e) {
    console.log(e)
}

