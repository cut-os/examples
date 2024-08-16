import {CoreClass} from '@cutos/core';
import {CMD, TYPE} from './driver-template-def.js';

class DriverTemplate extends CoreClass.Device {
    constructor(name) {
        super(name, TYPE);

        this.onData((data) => {
            console.log("on data", data)
        });
    }

    /**
     *
     * @param callback(result)
     */
    connect(callback) {
        let cmdMessage = {cmd: CMD.CONNECT};
        this.sendCommand(cmdMessage, callback);
    }

    customCmd() {
        let cmdMessage = {cmd: CMD.CUSTOM_CMD, args: ""};
        this.sendCommand(cmdMessage);
    }
}

export {DriverTemplate};
