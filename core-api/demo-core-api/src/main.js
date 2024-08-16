import('./style/init.css');
import {CoreAPI} from '@cutos/core';
import {config} from "./js/config";
import {renderText, renderNet, sendGetRequest} from './js/util';

// host is CUTOS IP address the default value is localhost,
// which can be modified to the target address during development，eg：192.168.1.11.
const host = null;
CoreAPI.init(host, (result, error) => {
        if (error) {
            console.log('core API init failed:', error.message)
            return
        }
        renderNet(true);
        demoCoreApi()
    }
);

renderText('params-title', config.params.title)

function demoCoreApi() {
    console.log(CoreAPI.getVersion());

    CoreAPI.getPlatform(function (result) {
        renderText('platform-text', result)
    });

    CoreAPI.getConfig(function (result) {
        renderText('config-text', result)
    });

    CoreAPI.getBoxInfo(function (result) {
        renderText('info-text', result)
    });

    CoreAPI.getDeviceInfo(function (result) {
        renderText('device-text', result)
    });

    CoreAPI.getVolume(function (result) {
        document.querySelector('#form-row-volume').value = result
    });

    CoreAPI.setHttpProxy('api', 'https://cut-os.com', (result, error) => {
        if (!error) {
            sendGetRequest(`http://${host}:3000${result.path}/rest/sv/system/runtime/ping`).then(response => {
                console.log('request success: ', response);
            }).catch(err => {
                console.log("ERROR: ", err);
            })
        }
    });

    CoreAPI.getNotification().register(({event, msg}) => {
        switch (event) {
            case 'networkConnection':
                renderNet(!!msg);
                break;
        }
    })


    // logger
    let logger = CoreAPI.getLogger();
    let url_ok = `https://cut-os.com/rest/sv/system/runtime/ping`;
    let url_error = `https://cut-os.com/rest/ping`;

    function req(url) {
        sendGetRequest(url).then(response => {
            // handle success
            logger.info("GET: " + url, 'success');
            document.querySelector('#successRet').innerText = JSON.stringify(response);
        }).catch(err => {
            // handle error
            logger.error("GET: " + url, err);
            document.querySelector('#errorRet').innerText = err;
        })
    }

    document.querySelector('#successBtn').addEventListener('click', () => {
        req(url_ok)
    })
    document.querySelector('#errorBtn').addEventListener('click', () => {
        req(url_error)
    })
    document.querySelector('#setVolumeBtn').addEventListener('click', () => {
        let v = document.querySelector('#form-row-volume').value
        CoreAPI.setVolume(v, (result, error) => {
            if (!error) {
                document.querySelector('#setVolumeRet').innerText = JSON.stringify(result)
            }
        })
    })
}
