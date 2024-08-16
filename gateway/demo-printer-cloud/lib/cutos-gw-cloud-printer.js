import {DevicePrinter} from './cutos-devices';
import {CoreAPI} from './cutos'
const coreAPI = new CoreAPI();
const notify = coreAPI.getNotification()
class CloudDevicePrinter {
    responseError(payload, err) {
        let context = payload.context;
        if (context.ackTopic) {
            let result = {};
            result.context = context;
            result.status = false;
            result.data = err;
            this.ipc.publishResponse(context.ackTopic, result);
        }
    }

    processData(payload) {
        console.warn(payload)
        let data = payload.body.data;
        try {
            switch (data.cmd) {
                case 'printDataUrl':
                    this.printer.printDataUrl(data.args.dataUrl, data.args.printer, payload.context);
                    console.log('data: ' + JSON.stringify(data));
                    break;
                case 'printTestPage':
                    this.printer.printTestPage(data.args.printer, payload.context);
                    console.log('data: ' + JSON.stringify(data));
                    break;
                case 'readDeviceInfo':
                    this.printer.readDeviceInfo(payload.context);
                    console.log('data: ' + JSON.stringify(data));
                    break;
                default:
                    this.responseError(payload, 'unknown cmd: ' + data.cmd);
                    console.log('unknown cmd: ' + data.cmd);
            }
        } catch (err) {
            this.responseError(payload, 'unknown cmd: ' + data.cmd);
            console.error(err.message);
        }
    }

    constructor(ipc) {
        this.ipc = ipc;
        this.printer = new DevicePrinter(()=>{

        });

        this.ipc.onAppData((topic, payload) => {
            console.log(topic);
            console.log(payload);
            let body = payload.body;

            switch (body.type) {
                case 'device-printer':
                    notify.emit('request', JSON.stringify(payload))
                    this.processData(payload);
                    break;
                default:
                    console.log('unknown type: ' + body.type);
            }
        });
        this.printer.onData((data) => {
            let {context} = data;
            if (context && context.ackTopic) {
                this.ipc.publishResponse(context.ackTopic, data);
                console.log('Printer response: ' + JSON.stringify(data));
                notify.emit('response', JSON.stringify(data))
            }
        });
    }
}

export {
    CloudDevicePrinter
};