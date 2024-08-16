/**
 * Copyright (C) 2010-2023 - SipTimes Technologies Corporation - All rights reserved.
 */
const CORE = Object.freeze({// core level api
    PLATFORM: 'core-platform',
    CONFIG: 'core-config',
    BOX_INFO: 'core-box-info',
    SIGN_INFO: 'core-sign-info',
    SIGN_GROUP_INFO: 'core-sign-group-info',
    SHELL: 'core-shell',
    DATABASE: 'core-database',
    GET_VOLUME: 'core-get-volume',
    SET_VOLUME: 'core-set-volume'
})
const CORE_NORESP = Object.freeze({// core level api with no response
    IPC: 'core-ipc',
    HEARTBEAT_PING: 'core-heartbeat-ping',
    HEARTBEAT_REGISTER: 'core-heartbeat-register',
    HEARTBEAT_UNREGISTER: 'core-heartbeat-unregister',
    LOGGER: 'core-logger'
})
const CORE_APP = Object.freeze({// application level api, notification from core
    NOTIFICATION: 'core-notification',
    HEARTBEAT_LISTENER: 'core-heartbeat-listener'
})

const DEVICE = Object.freeze({// core level api
    CHANNEL: 'device-channel',
    DEFAULT: 'device-default',
    ID_CARD_READER: 'device-id-card-reader',
    NFC: 'device-nfc',
    FINGERPRINT_READER: 'device-fingerprint-reader',
    QR_CODE_SCANNER: 'device-qr-code-scanner',
    PRINTER: 'device-printer'
})

const HEARTBEAT_STATUS = Object.freeze({
    REGISTER: 'register',
    ALIVE: 'alive',
    ERROR: 'error',
    NOT_FOUND: 'not-found',
    SUCCESS: 'success'
})
const cutosAPI = {
    version: '2.0.1',
    CORE,
    CORE_NORESP,
    CORE_APP,
    DEVICE,
    HEARTBEAT_STATUS
}
export {cutosAPI}
