import axios from 'axios';
import qs from "qs";

let query = location.href.split("?")[1];
let {token, api} = qs.parse(query);
let context = {}

console.log('token', token, 'api', api);

axios.post(api, {
    token: token
}).then(rep => {
    console.log('response', rep);
    context.appId = rep.data.appId;
    context.session = rep.data.session;
    context.loginUrl = rep.data.loginUrl;

    doRequest();

}).catch(e => {
    console.log(e);
})

function doRequest() {
    let counter = 0;
    let handler = setInterval(function () {

        test();

        counter++;
        if (counter >= 10) {
            clearInterval(handler);
        }
    }, 1000);
}

function test() {
    axios.get('http://localhost:8080/test', {
        headers: {
            appId: context.appId,
            session: context.session
        }
    }).then(rep => {
    }).catch(e => {
        console.log(e);
        if (e.response.status === 401) {
            window.location = context.loginUrl;
        }
    });
}