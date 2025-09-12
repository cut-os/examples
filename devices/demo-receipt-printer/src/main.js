/**
 * This demo mainly demonstrates the following APIs of DeviceReceiptPrinter
 */
import {CoreAPI} from '@cutos/core';
import {DeviceReceiptPrinter} from '@cutos/device-receipt-printer';
import {config} from './js/config.js';
import {renderNet, renderText} from './js/util'
import './style/init.css'

let devPrinter = null
// host is CUTOS IP address the default value is localhost,
// which can be modified to the target address during development，eg：192.168.1.11.
const host = '192.168.1.110';
CoreAPI.init(host, (result, error) => {
    if (error) {
        console.log(error)
        return;
    }
    renderNet(true);
    demoDevicePrinter();
});

const lwaInfo = ['name', 'version', 'description'];
for (let key of lwaInfo) {
    document.querySelector('#lwa-' + key).innerText = config[key]
}
renderText('params-title', config.params.title)
function demoDevicePrinter() {

    CoreAPI.getNotification().register(({event, msg}) => {
        switch (event) {
            case 'networkConnection':
                renderNet(!!msg);
                break;
        }
    })

    devPrinter = new DeviceReceiptPrinter();
    devPrinter.init((result, error) => {
        if (error) {
            console.log(error)
            return;
        }
        console.log(result)
    });

    devPrinter.onData(function (data) {
        renderText('result', data);

        let resp = data.response;
        if (!resp.status) {
            console.warn('err:', resp.msg);
            return;
        }
        switch (data.cmd) {
            default:
                console.log("Printer data: " + JSON.stringify(data));
        }
    });
    
    const print = () => {
        devPrinter.setAlign('center')
        devPrinter.printQrcode('hello cutos')
        devPrinter.feed(1)
        devPrinter.feed(1)
        devPrinter.print('脉搏：60 次/分')
        devPrinter.print('舒张压：60 mmHg')
        devPrinter.print('收缩压：101 mmHg')
        devPrinter.print('血压：')
        devPrinter.print('测量结果')
        devPrinter.feed(10)
    }
    document.querySelector('#print_test_page').addEventListener('click', () => {
        if (devPrinter) {
            print(); // default printer
        }
    })
    
}


