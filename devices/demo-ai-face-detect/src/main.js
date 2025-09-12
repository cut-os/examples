import('./style/init.css');
import { IPC } from '@cutos/gw-client'

import { CoreAPI } from "@cutos/core";
import { Face } from '@cutos/ai-face-detect'

import { config } from './lib/config'
const { params } = config
const compare = [];
const CUTOS_HOST = params.host || null // CUTOS 客户端地址, 传空则使用默认地址
const GW_URL = params.gwUrl // CUTOS 网关地址, 传空则使用默认地址

// 创建人脸检测实例
const faceInstance = new Face()

document.querySelector('.title').innerText = config.name

/**
 * 初始化lwa与CUTOS客户端之间的连接
 * @param host
 * @returns {Promise<unknown>}
 */
function initCutOS(host) {
    return new Promise((resolve, reject) => {
        CoreAPI.init(host, (ret, err) => {
            if(!err) {
                resolve(ret)
            } else {
                reject(err)
            }
        });
    })
}
/**
 *   useCamera打开摄像头并返回视频流
 */
function initGwIPC(gwURL) {
    return new Promise((resolve, reject) => {
        CoreAPI.getDeviceInfo(({ id, gwi, name, token, gwUrl, ...others }) => {
            // 通过coreAPI获取连接gateway所需凭证
            const gwIPC= new IPC(gwURL || gwUrl, {
                username: id,
                token: token,
                gwi: gwi
            }, ({status, msg}) => {
                if(status) {
                    // IPC 成功连接到gateway
                    resolve(gwIPC)
                } else {
                    reject(msg)
                }
            })
        })
    })
}

async function useCamera() {
    const constraints = {video: true, audio: false};
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return {
        stream,
        closeCamera: () => {
            stream.getTracks().forEach(t => t.stop());
        }
    }
}
/**
 *  Function useCamera()打开摄像头并返回视频流及关闭方法
 */
async function renderVideo(stream) {
    const $cam = document.querySelector('#cam')
    $cam.srcObject = stream
    await new Promise((resolve) => {
        $cam.oncanplaythrough = async () => {
            await $cam.play();
            resolve();
        };
    });
    return {
        $cam,
        pause: () => {
            $cam.pause()
        }
    }
}
/**
 *  Function start() LWA启动流程
 */
async function start() {
    await initCutOS(CUTOS_HOST)
    const gwClient = await initGwIPC(GW_URL)
    await faceInstance.init(gwClient)
}
/**
 *  Function detectionLoop() 循环检测人脸
 */
function detectionLoop($cam) {
    return new Promise((resolve) => {
        async function loop() {
            console.time('detect')
            const result = await faceInstance.detectSingleFace($cam);
            console.timeEnd('detect')
            // 判断识别结果，如果分数高于阈值，则结束循环，并将结果返回，否则继续循环
            if (result && result.score > 0.9) {
                resolve(result);
                return;
            }
            console.log('No face detected');
            // requestAnimationFrame(loop);
            setTimeout(loop, 100);
        }
        loop();
    });
}
function finishLoading() {
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('.main-card').style.display = 'flex';
    document.querySelector('.alert').style.display = 'flex';
}
function showFace(base) {
    document.querySelector('.cam-image').src = base
    document.querySelector('.cam-image').style.display = 'inline-block'
}

function disableButton() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(el => el.classList.add('disabled'));
}
function enableButton() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(el => el.classList.remove('disabled'));
}

function showAlert(text) {
    const alert = document.querySelector('.alert');
    alert.style.transform = 'translateY(0)';
    alert.querySelector('.text').innerText = 'ID:' + text;
}
function hideAlert() {
    const alert = document.querySelector('.alert');
    alert.style.transform = 'translateY(-100%)';
    alert.querySelector('.text').innerText = '';
}

async function handleClick(mode) {
    console.log('mode: ', mode);
    disableButton();
    hideAlert();
    console.time('openCamera')
    const { stream, closeCamera } = await useCamera()
    console.timeEnd('openCamera')
    console.time('renderVideo')
    const { $cam, pause } = await renderVideo(stream)
    console.timeEnd('renderVideo')
    const { face, fullFrame } = await detectionLoop($cam)
    //人脸比对测试，先点注册，再点搜索
    compare.push(face);
    console.log('handleClick:compare',compare)
    if(compare.length===2){
        console.log('人脸检测',faceInstance.compare(compare[0], compare[1]))
    }
    showFace(face)
    pause()
    closeCamera()
    console.time('gateway')
    // faceInstance提供4个方法，register、search、unregister, compare
    const ret = await faceInstance[mode](fullFrame)
    console.timeEnd('gateway')
    return ret
}
start().then(() => {
    finishLoading()
    document.querySelector('#search').addEventListener('click', async () => {
        try {
            const ret = await handleClick('search')
            showAlert(ret.id);
            enableButton()
        } catch (e) {
            console.error('handleClick error: ', JSON.stringify(e))
            enableButton()
        }
    })
    document.querySelector('#register').addEventListener('click', async () => {
        try {
            const ret = await handleClick('register')
            showAlert(ret);
            enableButton()
        } catch (e) {
            console.error('handleClick error: ', JSON.stringify(e))
            enableButton()
        }
    })
    document.querySelector('#unregister').addEventListener('click', async () => {
        try {
            disableButton()
            const id = document.querySelector('.gw-result').innerText.replace('ID:', '');
            const ret = await faceInstance['unregister'](id);
            setTimeout(() => {
                hideAlert();
                alert('注销成功:' + ret)
                enableButton()
            }, 1000)
        } catch (e) {
            console.error('handleClick error: ', JSON.stringify(e))
            enableButton()
        }
    })
}).catch(e => {
    enableButton()
    console.error('start error: ', JSON.stringify(e))
})
