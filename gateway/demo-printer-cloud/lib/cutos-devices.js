"use strict";

import {
    CoreDefine,
    CoreClass
} from './cutos';

class DeviceNFC extends CoreClass.Device {
    constructor(callback, name = "NFC") {
        super(name, CoreDefine.DEVICE.NFC, callback);
    }
}

class DeviceIDCardReader extends CoreClass.Device {
    constructor(callback, name = "ID-CARD-READER") {
        super(name, CoreDefine.DEVICE.ID_CARD_READER, callback);
    }

    connect() {
        super.sendCommand({cmd: "connect", args: ""});
    }

    disconnect() {
        super.sendCommand({cmd: "disconnect", args: ""});
    }

    readCard() {
        super.sendCommand({cmd: "read-card", args: ""});
    }
}

class DeviceFingerprintReader extends CoreClass.Device {
    constructor(callback, name = "FINGERPRINT-READER") {
        super(name, CoreDefine.DEVICE.FINGERPRINT_READER, callback);
    }
}

class DeviceQrCodeScanner extends CoreClass.Device {
    constructor(callback, name = "QR-CODE-SCANNER") {
        super(name, CoreDefine.DEVICE.QR_CODE_SCANNER, callback);
    }
}

class DevicePrinter extends CoreClass.Device {
    constructor(callback, name = "PRINTER") {
        super(name, CoreDefine.DEVICE.PRINTER, callback);
    }

    printFile(fileName, printer) {
        super.sendCommand({
            cmd: "print",
            args: {
                filename: fileName,
                printer: printer
            }
        });
    }

    printPdfBuffer(buffer, printer) {
        super.sendCommand({
            cmd: "print-pdf-buffer",
            args: {
                buffer: buffer,
                printer: printer
            }
        });
    }

    /**
     * print pdf file code in data url
     * @param dataUrl data:application/pdf;base64,<data>
     * @param printer
     * @param context - 消息上下文
     */
    printDataUrl(dataUrl, printer, context) {
        super.sendCommand({
            context: context,
            cmd: "print-data-url",
            args: {
                dataUrl: dataUrl,
                printer: printer
            }
        });
    }

    printTestPage(printer, context) {
        super.sendCommand({
            context: context,
            cmd: 'print-test',
            args: {
                printer: printer
            }
        });
    }
}

export {
    DeviceNFC,
    DeviceIDCardReader,
    DeviceFingerprintReader,
    DeviceQrCodeScanner,
    DevicePrinter
};
