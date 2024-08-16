import {v4 as uuidv4} from 'uuid'
import mqtt from 'mqtt/dist/mqtt';

const callbackMap = new Map();

class IPC {
    initGwClient(gwi) {
        this.gwi = gwi;
        this.clientTopic = "gw/" + this.gwi + "/lwa/" + this.clientId;
        this.clientTopicAck = "gw/" + this.gwi + "/lwa/" + this.clientId + "/ack";
        this.gwTopicLogin = "gw/" + this.gwi + "/gw/" + this.clientId + "/login";
        this.appTopicLogin = "gw/" + this.gwi + "/app/" + this.clientId + "/login";
        this.client.subscribe(this.clientTopic);
        this.client.subscribe(this.clientTopicAck);
    }

    clientAck(payload) {

    }

    constructor(gwUrl, gwi, username, token) {
        this.clientId = username;

        let opts = {
            clientId: uuidv4(),
            keepalive: 30,
            connectTimeout: 10 * 1000,
            reconnectPeriod: 1000,
            clean: true,
            username: username + '',
            password: token
        }

        //test code
        let state_topic = 'gw/' + gwi + '/lwa/' + this.clientId + '/state'
        opts.will = {
            topic: state_topic,
            payload: JSON.stringify({
                clientId: this.clientId,
                lwa: {connection: "disconnected"}
            }),
            retain: true,
        }
        this.client = mqtt.connect(gwUrl, opts);
        this.client.on('connect', () => {
            this.initGwClient(gwi)
            this.client.publish(state_topic, JSON.stringify({
                    clientId: this.clientId,
                    lwa: {connection: "connected"}
                }),
                {
                    qos: 1,
                    messageId: 1,
                    topic: state_topic,
                    retain: true,
                });
        });

        this.client.on('message', (topic, message) => {
            console.debug("topic: " + topic);
            console.debug("message content: " + message.toString());
            let payload = JSON.parse(message);
            switch (topic) {
                case this.clientTopic:
                    if (typeof this.appDataCallback === "function") {
                        this.appDataCallback(topic, payload);
                    } else {
                        console.error("appDataCallback NOT set!");
                    }
                    break;
                case this.clientTopicAck:
                    this.clientAck(payload);
                    break;
                default:
                    console.log("Unexpected topic: " + topic);
            }
        });

        this.client.on("close", () => {
            console.log("GW MQTT closed.");
        });

        this.client.on("error", (e) => {
            console.error("GW MQTT error.", e.message);
        });
    }

    onAppData(callback) {
        this.appDataCallback = callback;
    }

    publishRequest(topic, body, callback, userContext) {
        let request = {};
        request.body = body;
        request.context = {};
        request.context = userContext;
        request.context.id = uuidv4();
        if (typeof callback === "function") {
            let callbackItem = {};
            callbackItem.callback = callback;
            callbackItem.timeStamp = Date.now();
            callbackMap.put(context.id, callbackItem);
        }
    }

    publishResponse(topic, body) {
        this.client.publish(topic, JSON.stringify(body));
    }

    loginGw(username, password, callback) {
        let body = {username: username, password: password};
        this.client.publishRequest(this.gwTopicLogin, JSON.stringify(body), callback);
    }

    loginApp(username, password, callback) {
        let body = {username: username, password: password};
        this.client.publishRequest(this.appTopicLogin, JSON.stringify(body), callback);
    }
}

export {
    IPC
};