import {DeviceNFC} from "@cutos/devices";
import {promisify} from "./cutos-async";

DeviceNFC.prototype.initAsync = function () {
    return promisify(this.init, this)()
}
DeviceNFC.prototype.connectAsync = function (path) {
    return promisify(this.connect, this)(path)
}


