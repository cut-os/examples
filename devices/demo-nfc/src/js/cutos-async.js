import {CoreAPI} from "@cutos/core";

const promisify = (func, obj) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            func.call(obj, ...args, (result, error) => {
                if (error) {
                    reject(error)
                } else if (result.status === undefined && result.msg === undefined) {
                    resolve(result)
                } else {
                    if (result.status) {
                        resolve(result.msg)
                    } else {
                        reject(result.msg)
                    }
                }
            })
        })
    }
}

CoreAPI.initAsync = (host)=>promisify(CoreAPI.init)(host)

export {
    promisify,
}


