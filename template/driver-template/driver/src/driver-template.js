const {CoreDefine, CoreClass} = require('@cutos/core');
const {TYPE, CMD} = require('./driver-template-def.js');
const config = require('./config.json');

class DriverTemplate extends CoreClass.Driver {
    constructor(args) {
        // check
        if (TYPE !== config.type) {
            throw "Error: the 'type' value in config.json and *-def.js MUST be identical.";
        }
        super(args.name, TYPE);

        this.startBeat();
        this.updateStatusInfo(CoreDefine.HEARTBEAT_STATUS.ALIVE, "alive");

        this.onCommand(({cmd, args}, callback) => {
            switch (cmd) {
                // 必须实现
                case CMD.CONNECT:
                    this.connect(args, callback);
                    break;
                case CMD.CUSTOM_CMD:
                    this.customCmd(cmd, args);
                    break;
                default:
                    this.unsupported(cmd, args, callback);
                    break;
            }
        });
    }

    unsupported(cmd, args, callback) {
        let result = {};
        result.msg = "cmd: " + cmd + " is unsupported.";
        result.status = false;
        console.log(result.msg);
        callback(result);
    }

    connect(args, callback) {
        console.log("connect: received.");
        let result = {};
        result.msg = "return success.";
        result.status = true;
        callback(result);
    }

    // no response
    customCmd(cmd, args) {
        console.log("cmd: " + cmd + args, " received.");
        // process cmd below
    }

    sendCustomData() {
        let data = {};
        data.type = "custom-type"; // custom defined data type
        data.values = {}; // values from template driver
        data.values.val = "any value";
        data.values.timeStamp = Date.now();
        this.sendData(data);
    }
}

module.exports = DriverTemplate;
