import {CoreAPI} from '../lib/cutos';
import {IPC} from '../lib/cutos-gw-client';
import {CloudDevicePrinter} from '../lib/cutos-gw-cloud-printer';
import {renderNet, renderMessage} from './js/example';
import {config} from '../lib/utils';
import './style/init.css'

const coreAPI = new CoreAPI();
document.querySelector('#lwa-gateway-url').innerText = config.gatewayUrl
document.querySelector('#params-text').innerText = app_config['name']

coreAPI.shell('echo 1 | sudo tee /sys/devices/platform/leds/leds/net_led/brightness', msg => {})

coreAPI.getBoxInfo(function (result) {
    renderNet(!!result.status);
});

coreAPI.getNotification().register(({event, msg}) => {
    switch (event) {
        case 'networkConnection':
            let cmd = 'echo ' + (msg ? 1 : 0) + ' | sudo tee /sys/devices/platform/leds/leds/net_led/brightness'
            coreAPI.shell(cmd, msg => {})
            renderNet(!!msg);
            break;
        case 'request':
            console.log(event, msg)
            renderMessage(event, msg)
            break;
        case 'response':
            console.log(event, msg)
            renderMessage(event, msg)
            break;
        default:
            console.warn(event, msg)
    }
})
let gwUrl = config.gatewayUrl || 'ws://www.cut-os.com:61614';
const timer = setInterval(() => {
    if (coreAPI.connected()) {
        clearInterval(timer)
        coreAPI.getSignInfo(({id, name, token, gwi}) => {
            console.log(id, token)
            document.querySelector('#lwa-id').innerText = id
            document.querySelector('#lwa-device').innerText = name
            document.querySelector('#lwa-token').innerText = token
            let ipc = new IPC(gwUrl, gwi, id, token);
            new CloudDevicePrinter(ipc);
        })
    } else {
        console.warn('coreapi is not ready')
    }
}, 100)