import {CoreAPI} from '@cutos/core';
import {config} from "./js/config";

// host is CUTOS IP address the default value is localhost,
// which can be modified to the target address during development，eg：192.168.1.11.
const host = null;
CoreAPI.init(host, (result, error) => {
    if (error) {
        console.log('CoreAPI.init Error:', error.message);
        return;
    }
    document.querySelector(`#cutos-version`).innerText = CoreAPI.getVersion();
    document.querySelector(`#lwa-version`).innerText = config.version;

    CoreAPI.getNotification().register(({event, msg}) => {
        console.log(event, msg);
    })
})
