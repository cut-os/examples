// test driver
const {CoreSimulator} = require('@cutos/core');

const aedes = require('aedes')();
const {createServer} = require('aedes-server-factory');
const server = createServer(aedes, {ws: true});
const port = 1883
server.listen(port);

const drv = require("../src");
CoreSimulator.start(drv, port);
