/**
 * This demo mainly demonstrates the following APIs of DevicePrinter
 * readDeviceInfo
 * printTestPage
 * printPdfUrl
 */
import {CoreAPI} from '@cutos/core';
import {DevicePrinter} from '@cutos/devices';
import {config} from './js/config.js';
import {renderNet, renderText} from './js/util'
import './style/init.css'

let devPrinter = null
// host is CUTOS IP address the default value is localhost,
// which can be modified to the target address during development，eg：192.168.1.11.
const host = null;
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
let $receipt = document.querySelector('#isReceipt')
function demoDevicePrinter() {

    CoreAPI.getNotification().register(({event, msg}) => {
        switch (event) {
            case 'networkConnection':
                renderNet(!!msg);
                break;
        }
    })

    devPrinter = new DevicePrinter();
    devPrinter.init((result, error) => {
        if (error) {
            console.log(error)
            return;
        }
        console.log(result)

        devPrinter.readDeviceInfo(data => {
            renderText('info', data)
        });
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


    document.querySelector('#print_test_page').addEventListener('click', () => {
        if (devPrinter) {
            let printer = document.querySelector('#printer-name').value || null
            devPrinter.printTestPage(printer, { portable: $receipt.checked }); // default printer
        }
    })

    document.querySelector('#print_pdf_url').addEventListener('click', () => {
        if (devPrinter) {
            let pdfUrl = 'https://oss.cut-os.com/resources/developer/examples/printer/print-sample.pdf';
            let printer = document.querySelector('#printer-name').value || null
            devPrinter.printPdfUrl(pdfUrl, printer, { portable: $receipt.checked });
        }
    });
}


