import {CoreAPI} from '@cutos/core';
import {DriverTemplate} from '../src/driver-template.js';


CoreAPI.init(null, (result, error) => {
    if (error) {
        console.log(error)
        return;
    }
    console.log(result)

    let device = new DriverTemplate('driver-template');
    device.init((result, error) => {
        if (error) {
            console.log(error)
            return;
        }
        console.log(result)

        device.connect((result) => {
            console.log("connect:", result)
        });
        device.customCmd();
        device.sendCommand({cmd: "unknown", args: ""}, (result) => {
            console.log('unknown:', result)
        });
    });
});
