import {DeviceFingerprint} from "@cutos/devices";
import {promisify} from "./cutos-async";

DeviceFingerprint.prototype.initAsync = function () {
    return promisify(this.init, this)()
}
DeviceFingerprint.prototype.connectAsync = function (path) {
    return promisify(this.connect, this)(path)
}
DeviceFingerprint.prototype.authAsync = function () {
    return promisify(this.auth, this)()
}
DeviceFingerprint.prototype.adminAsync = function () {
    return promisify(this.admin, this)()
}
DeviceFingerprint.prototype.createUser1Async = function (userID) {
    return promisify(this.createUser1, this)(userID)
}
DeviceFingerprint.prototype.createUser2Async = function (userID) {
    return promisify(this.createUser2, this)(userID)
}
DeviceFingerprint.prototype.createUser3Async = function (userID) {
    return promisify(this.createUser3, this)(userID)
}
DeviceFingerprint.prototype.deleteUserAsync = function (userID) {
    return promisify(this.deleteUser, this)(userID)
}
DeviceFingerprint.prototype.deleteAllAsync = function () {
    return promisify(this.deleteAll, this)()
}

