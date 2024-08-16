import {promisify} from "./cutos-async";
import {CoreClass} from "@cutos/core";

const Database = CoreClass.Database;
const Table = Database.Table;

Database.prototype.connectAsync = function () {
    return promisify(this.connect, this)()
}
Database.prototype.runAsync = function (sql) {
    return promisify(this.run, this)(sql)
}


Table.prototype.createAsync = function () {
    return promisify(this.create, this)()
}

Table.prototype.insertAsync = function (object, opts) {
    return promisify(this.insert, this)(object, opts)
}
Table.prototype.insertByIdAsync = function (id, object, opts) {
    return promisify(this.insertById, this)(id, object, opts)
}
Table.prototype.insertByKeyAsync = function (key, object, opts) {
    return promisify(this.insertByKey, this)(key, object, opts)
}

Table.prototype.updateAsync = function (id, object) {
    return promisify(this.update, this)(id, object)
}
Table.prototype.updateByKeyAsync = function (key, object) {
    return promisify(this.updateByKey, this)(key, object)
}

Table.prototype.deleteAsync = function (id) {
    return promisify(this.delete, this)(id)
}

Table.prototype.queryAsync = function (id) {
    return promisify(this.query, this)(id)
}
Table.prototype.queryByKeyAsync = function (key) {
    return promisify(this.queryByKey, this)(key)
}
Table.prototype.queryByTidAsync = function (tid) {
    return promisify(this.queryByTid, this)(tid)
}
Table.prototype.queryUnsyncedAsync = function () {
    return promisify(this.queryUnsynced, this)()
}
Table.prototype.queryAllAsync = function () {
    return promisify(this.queryAll, this)()
}

Table.prototype.syncAsync = function (key) {
    return promisify(this.sync, this)(key)
}

