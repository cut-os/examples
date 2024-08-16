import {CoreAPI} from '@cutos/core';
import {DeviceFingerprint} from '@cutos/devices'
import {config} from './js/config.js';
import {renderNet, renderText, modalShow, modalHide, toastShow} from './js/util'

import './js/cutos-devices-async'
import './style/init.css'

let device = null
let step = 0
// host is CUTOS IP address the default value is localhost,
// which can be modified to the target address during development，eg：192.168.1.11.
const host = null;

function showLWAInfo() {
    const lwaInfo = ['name', 'version', 'description'];
    for (let key of lwaInfo) {
        document.querySelector('#lwa-' + key).innerText = config[key]
    }
    renderText('params-title', config.params.title)
}

function initListeners() {
    const modeCheck = document.querySelector('#mode-check')
    const modeText = document.querySelector('#mode-text')
    const operations = document.querySelector('#operations')
    const deleteAll = document.querySelector('#delete-all')
    const deleteOne = document.querySelector('#delete-user')
    const addOne = document.querySelector('#add-user')
    const closeModal = document.querySelector('#close')
    const operation = document.querySelector('#operation')

    operations.style.visibility = 'hidden'

    modeCheck.addEventListener('change', async () => {
        if (modeCheck.checked) {
            await device.adminAsync()
            modeText.innerText = '管理模式'
            operations.style.visibility = 'visible'
        } else {
            await device.authAsync()
            modeText.innerText = '识别模式'
            operations.style.visibility = 'hidden'
        }
    })

    deleteAll.addEventListener('click', async () => {
        try {
            await device.deleteAllAsync()
            toastShow('删除成功')
        } catch (e) {
            toastShow('删除失败')
        }
    })

    deleteOne.addEventListener('click', async () => {
        const userID = document.querySelector('#user-id')
        const id = parseInt(userID.value)
        if (!id) {
            toastShow('未指定ID,请先指定ID')
            return
        }
        try {
            await device.deleteUserAsync(id)
            toastShow('删除成功')
        } catch (e) {
            toastShow('删除失败')
        }
    })

    operation.addEventListener('click', async () => {
        await operationButtonClicked()
    })

    addOne.addEventListener('click', () => {
        const userID = document.querySelector('#user-id')
        const id = parseInt(userID.value)
        if (!id) {
            toastShow('未指定ID,请先指定ID')
            return
        }
        modalShow();
        step = 0
    })
    closeModal.addEventListener('click', () => modalHide())
}

function reset(tip, status, btn) {
    tip.innerText = '请按压手指，并等待识别结果'
    status.src = 'fp-a.png'
    btn.style.visibility = 'hidden'
}

function next(tip, status, btn) {
    btn.innerText = '继续'
    tip.innerText = '请抬起手指，并点击继续'
    status.src = 'fp-b.png'
    btn.style.visibility = 'visible'
    step++
}

function complete(tip, status, btn, success) {
    tip.innerText = success ? '创建成功' : '创建失败，请重试'
    btn.innerText = '开始'
    status.src = 'fp-a.png'
    btn.style.visibility = 'visible'
    step = 0
}

async function operationButtonClicked() {
    const status = document.querySelector('#status')
    const tip = document.querySelector('#tip')
    const btn = document.querySelector('#operation')
    const userID = document.querySelector('#user-id')
    const id = parseInt(userID.value)
    try {
        if (step === 0) {
            reset(tip, status, btn)
            await device.createUser1Async(id)
            next(tip, status, btn)
        } else if (step === 1) {
            reset(tip, status, btn)
            await device.createUser2Async(id)
            next(tip, status, btn)
        } else if (step === 2) {
            reset(tip, status, btn)
            await device.createUser3Async(id)
            complete(tip, status, btn, true)
        }
    } catch (e) {
        complete(tip, status, btn)
    }


}

async function lwaStart() {
    showLWAInfo()
    initListeners()
    await CoreAPI.initAsync(host)
    renderNet(true)
    device = new DeviceFingerprint()
    await device.initAsync()
    await device.connectAsync('/dev/ttyS6')
    device.onData(data => {
        renderText('identification', data)
    })
}

try {
    await lwaStart()
} catch (e) {
    console.log(e)
}





