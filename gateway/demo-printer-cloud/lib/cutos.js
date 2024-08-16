/**
 * Copyright (C) 2010-2023 - SipTimes Technologies Corporation - All rights reserved.
 */
import {v4 as uuidv4} from 'uuid'
import mqtt from "mqtt/dist/mqtt";

const mqttHost = 'ws://localhost:1883'
const client = mqtt.connect(mqttHost)
import {cutosAPI} from './cutos-api'

const callbackMap = new Map()
const listenerMap = new Map()

const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

client.on('connect', function () {
    for (let api in cutosAPI.CORE) {
        client.subscribe(cutosAPI.CORE[api] + '-callback')
    }
    for (let api in cutosAPI.CORE_NORESP) {
        client.subscribe(cutosAPI.CORE_NORESP[api] + '-endpoint')
    }
    for (let api in cutosAPI.CORE_APP) {
        client.subscribe(cutosAPI.CORE_APP[api])
    }
})

client.on('message', function (topic, message, context) {
    // message is Buffer
    // console.debug(topic.toString() + message.toString());
    let _message = JSON.parse(message);
    if (topic === cutosAPI.CORE_NORESP.IPC + '-endpoint') { // ipc

        let listener = listenerMap.get(_message.body.channel)
        if (listener !== undefined) {
            listener(_message.body.args, _message.context)
        }
    } else if (topic === cutosAPI.CORE_APP.NOTIFICATION || topic === cutosAPI.CORE_APP.HEARTBEAT_LISTENER || topic.startsWith(cutosAPI.DEVICE.CHANNEL)) {
        let listener = listenerMap.get(topic)
        if (listener !== undefined) {
            listener(_message)
        }
    } else {
        // cutos core api callback
        let callback = callbackMap.get(_message.id)
        if (typeof callback === 'function') {
            callbackMap.delete(_message.id)
            callback(_message.result)
        }
    }
})

client.on("error", (e) => {
    console.error("MQTT error.", e.message);
});

function publishRequest(api, callback, body, destAddress) {
    let request = {}
    request.context = {}
    request.context.id = uuidv4()
    request.context.destAddress = destAddress
    request.body = body
    if (typeof callback === 'function') {
        callbackMap.set(request.context.id, callback)
    }
    client.publish(api, JSON.stringify(request))
    return true
}

/*
  retentionTime: retention time, default 48 hours
 */
class Database {
    KEY_TYPE_TEXT = 'TEXT'
    KEY_TYPE_INTEGER = 'INTEGER'

    constructor(db, callback, retentionTime = 48) {
        // sub class
        this.Table = class {
            constructor(db, name, callback, retentionTime, keyType, keyName) {
                this.db = db
                this.name = name
                let body = {
                    db: this.db, cmd: 'db.table.create', name: name
                }
                if (retentionTime) {
                    body.retentionTime = retentionTime
                }
                if (keyType === 'INTEGER' || keyType === 'TEXT') {
                    body.keyName = keyName
                    body.keyType = keyType
                } else {
                    throw new Error('keyType MUST be INTEGER or TEXT')
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            insert(value, callback, tid) {
                let body = {
                    db: this.db, cmd: 'db.table.insert', name: this.name, value: value, tid: tid
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            insertById(id, value, callback, tid) {
                let body = {
                    db: this.db, cmd: 'db.table.insertById', name: this.name, id: id, value: value, tid: tid
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            insertByKey(key, value, callback, tid) {
                let body = {
                    db: this.db, cmd: 'db.table.insertByKey', name: this.name, key: key, value: value, tid: tid
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            update(id, value, callback) {
                let body = {
                    db: this.db, cmd: 'db.table.update', name: this.name, id: id, value: value
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            updateByKey(key, value, callback) {
                let body = {
                    db: this.db, cmd: 'db.table.updateByKey', name: this.name, key: key, value: value
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            delete(id, callback) {
                let body = {
                    db: this.db, cmd: 'db.table.delete', name: this.name, id: id
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            query(id, callback, count = 100) {
                let body = {
                    db: this.db, cmd: 'db.table.query', name: this.name, id: id
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            queryByKey(key, callback, count = 100) {
                let body = {
                    db: this.db, cmd: 'db.table.queryByKey', name: this.name, key: key
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            queryByTid(tid, callback, limit = 100) {
                let body = {
                    db: this.db, cmd: 'db.table.queryByTid', name: this.name, limit: limit, tid: tid
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            queryUnsynced(callback, limit = 100) {
                let body = {
                    db: this.db, cmd: 'db.table.queryUnsynced', name: this.name, limit: limit
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            queryAll(callback) {
                let body = {
                    db: this.db, cmd: 'db.table.queryAll', name: this.name
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }

            sync(id, callback) {
                let body = {
                    db: this.db, cmd: 'db.table.sync', name: this.name, id: id
                }
                return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
            }
        }
        this.db = db
        this.retentionTime = retentionTime
        let body = {
            cmd: 'db.connect', db: this.db
        }
        return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
    }

    run(sql, callback) {
        let body = {
            db: this.db, cmd: 'db.run', sql: sql
        }
        return publishRequest(cutosAPI.CORE.DATABASE, callback, body)
    }

    createTable(name, callback, retentionTime, keyType = 'INTEGER', keyName = 'id') {
        return new this.Table(null, name, callback, retentionTime, keyType, keyName)
    }
}

class Logger {
    constructor() {
    }

    info(remark, content, type = 'LWA') {
        let body = {
            type: type, level: 'info', remark: remark, content: content
        }
        return publishRequest(cutosAPI.CORE_NORESP.LOGGER, null, body)
    }

    warning(remark, content, type = 'LWA') {
        let body = {
            type: type, level: 'warning', remark: remark, content: content
        }
        return publishRequest(cutosAPI.CORE_NORESP.LOGGER, null, body)
    }

    error(remark, content, type = 'LWA') {
        let body = {
            type: type, level: 'error', remark: remark, content: content
        }
        return publishRequest(cutosAPI.CORE_NORESP.LOGGER, null, body)
    }

    debug(remark, content, type = 'LWA') {
        let body = {
            type: type, level: 'debug', remark: remark, content: content
        }
        return publishRequest(cutosAPI.CORE_NORESP.LOGGER, null, body)
    }
}

class IPC {
    constructor(destAddress) {
        if (destAddress === undefined || destAddress === null || destAddress.length === 0 || destAddress === 'localhost' || destAddress === '127.0.0.1') {
            this.destAddress = undefined
        } else if (destAddress.match(ipformat)) {
            this.destAddress = destAddress
        } else {
            throw new TypeError(destAddress + ' is NOT an ip address.')
        }
    }

    sendTo(channel, args) {
        let body = {}
        body.channel = channel
        body.args = args
        return publishRequest(cutosAPI.CORE_NORESP.IPC, null, body, this.destAddress)
    }

    on(channel, listener) {
        listenerMap.set(channel, listener)
    }

    removeListener(channel) {
        listenerMap.delete(channel)
    }
}

class Notification {
    constructor() {
    }

    register(listener) {
        listenerMap.set(cutosAPI.CORE_APP.NOTIFICATION, listener)
    }

    unregister() {
        listenerMap.delete(cutosAPI.CORE_APP.NOTIFICATION)
    }

    emit(event, msg) {
        client.publish(cutosAPI.CORE_APP.NOTIFICATION, JSON.stringify({event: event, msg: msg}));
        return true;
    }
}

class Heartbeat {
    STATUS = cutosAPI.HEARTBEAT_STATUS

    constructor(pinger, counter) {
        this.registered = false
        this.request = {}
        this.request.counter = counter
        this.request.pinger = pinger
        this.request.subscriber = cutosAPI.CORE_NORESP.HEARTBEAT_PING + '-' + pinger
    }

    register() {
        this.request.msg = {}
        this.request.msg.status = this.STATUS.REGISTER
        this.request.msg.info = `Start to monitor ${this.request.pinger}.`

        client.publish(cutosAPI.CORE_NORESP.HEARTBEAT_REGISTER, JSON.stringify(this.request))
        this.registered = true
    }

    ping(status, info = {}) {
        if (!this.registered) {
            throw 'The heartbeat is NOT registered!'
        }
        this.request.msg = {}
        this.request.msg.status = status
        this.request.msg.info = info
        client.publish(cutosAPI.CORE_NORESP.HEARTBEAT_PING, JSON.stringify(this.request))
    }
}

class Device {
    constructor(name = 'default-device-name', type = cutosAPI.DEVICE.DEFAULT, callback) {
        this.name = name
        this.type = type
        this.topicData = cutosAPI.DEVICE.CHANNEL + '-' + type + '-data'
        this.topicResponse = cutosAPI.DEVICE.CHANNEL + '-' + type + '-response'
        this.topicCommand = cutosAPI.DEVICE.CHANNEL + '-' + type + '-command'
        this.data = {}

        if (Device.objectMap === undefined) {
            Device.objectMap = new Map()
        }
        Device.objectMap.set(this.type, this)

        if (Device.heartbeatListener === undefined) {
            Device.heartbeatListener = function (msg) {
                for (const [key, obj] of Device.objectMap) {
                    if (obj.statusListener !== undefined) {
                        if (obj.type === 'default-device' || obj.type === msg.pinger) {
                            obj.statusListener(msg)
                            obj.msg = msg
                        }
                    }
                }
                // console.debug(JSON.stringify(msg))
            }
            listenerMap.set(cutosAPI.CORE_APP.HEARTBEAT_LISTENER, Device.heartbeatListener)
        }
        this.init(name, type, callback)
    }

    init(name, type, callback) {
        let command = {}
        command.cmd = 'init'
        command.args = {name: name, type: type}
        command.topicResponse = this.topicResponse
        let defaultTopic = cutosAPI.DEVICE.CHANNEL + '-' + cutosAPI.DEVICE.DEFAULT + '-command'
        client.publish(defaultTopic, JSON.stringify(command))

        // response callback
        client.subscribe(this.topicResponse) // receive response from device
        listenerMap.set(this.topicResponse, callback)
    }

    onStatus(listener) {
        this.statusListener = listener
    }

    getCurrentStatus() {
        return this.msg
    }

    sendCommand(command) {
        client.publish(this.topicCommand, JSON.stringify(command))
    }

    onData(listener) {
        client.subscribe(this.topicData) // receive data from device
        let _this = this
        listenerMap.set(this.topicData, function (data) {
            _this.data = data
            listener(data)
        })
    }

    getCurrentData() {
        return this.data
    }

    readDeviceInfo(context) {
        let msg = {}
        msg.cmd = 'read-device-info'
        msg.context = context
        this.sendCommand(msg)
    }
}

class Driver {
    constructor(name = 'default-driver-name', type = cutosAPI.DEVICE.DEFAULT, counter = 10) {
        this.name = name
        this.type = type
        this.heartbeat = new Heartbeat(type, counter)
        this.statusInfo = {}
        this.beatInterval = 3000
        this.topicData = cutosAPI.DEVICE.CHANNEL + '-' + type + '-data'
        this.topicResponse = cutosAPI.DEVICE.CHANNEL + '-' + type + '-response'
        this.topicCommand = cutosAPI.DEVICE.CHANNEL + '-' + type + '-command'
    }

    startBeat() {
        this.heartbeat.register()
        let _this = this
        setInterval(function () {
            if (_this.statusInfo.status !== undefined && _this.statusInfo.status !== _this.heartbeat.STATUS.REGISTER) {
                _this.heartbeat.ping(_this.statusInfo.status, _this.statusInfo.info)
            }
        }, _this.beatInterval)
    }

    updateStatusInfo(status = 'default-status', info = 'default-info') {
        this.statusInfo.status = status
        this.statusInfo.info = info
    }

    sendData(data) {
        client.publish(this.topicData, JSON.stringify(data))
    }

    sendResponse(data, topic = this.topicResponse) {
        client.publish(topic, JSON.stringify(data))
    }

    onCommand(listener) {
        client.subscribe(this.topicCommand) // receive command from app
        listenerMap.set(this.topicCommand, listener)
    }
}

class CoreAPI {
    connected() {
        return client.connected
    }

    getVersion() {
        return cutosAPI.version
    }

    getPlatform(callback) {
        return publishRequest(cutosAPI.CORE.PLATFORM, callback)
    }

    getConfig(callback) {
        return publishRequest(cutosAPI.CORE.CONFIG, callback)
    }

    getBoxInfo(callback) {
        return publishRequest(cutosAPI.CORE.BOX_INFO, callback)
    }

    getSignInfo(callback) {
        return publishRequest(cutosAPI.CORE.SIGN_INFO, callback)
    }

    getSignGroupInfo(callback) {
        return publishRequest(cutosAPI.CORE.SIGN_GROUP_INFO, callback)
    }

    getIPC(destAddress) {
        return new IPC(destAddress)
    }

    getNotification() {
        return new Notification()
    }

    getLogger() {
        return new Logger()
    }

    shell(command, callback) {
        return publishRequest(cutosAPI.CORE.SHELL, callback, command)
    }

    getDatabase(db, callback) {
        return new Database(db, callback)
    }

    getVolume(callback) {
        return publishRequest(cutosAPI.CORE.GET_VOLUME, callback);
    }

    setVolume(vol, callback) {
        return publishRequest(cutosAPI.CORE.SET_VOLUME, callback, vol);
    }

}

const CoreDefine = {
    DEVICE: cutosAPI.DEVICE, HEARTBEAT_STATUS: cutosAPI.HEARTBEAT_STATUS
}

const CoreClass = {
    Device, Driver
}

export {CoreAPI, CoreDefine, CoreClass}
