import('./style/init.css');
import {CoreAPI, CoreClass} from '@cutos/core';
import {config} from './js/config';
import {renderText, renderNet} from './js/util';
import './js/cutos-async.js'
import './js/cutos-database-async.js'

const host = '';
const Database = CoreClass.Database;
const Table = Database.Table;

async function demoDatabase() {

    const database = new Database();
    let result = await database.connectAsync();
    renderText('database-text', result);

    const device = new Table('device', database);
    result = await device.createAsync();
    renderText('table-text', result);

    let tid = 'tra-001';

    result = await database.runAsync('delete from device');

    let nec = await device.insertAsync({type: 'printer', name: 'NEC'}, {tid: tid});
    renderText('insert-text', nec)

    let hp = await device.insertAsync({type: 'printer', name: 'HP-1'}, {tid: tid});
    renderText('insert2-text', hp)

    result = await device.updateAsync(nec.row, {type: 'printer', name: 'NEC-2'});
    renderText('update-text', result)

    result = await device.syncAsync(nec.row);
    renderText('sync-text', result)

    result = await device.queryAsync(nec.row);
    renderText('query-text', result)

    result = await device.queryUnsyncedAsync();
    renderText('queryUnsynced-text', result)

    result = await device.queryAllAsync();
    renderText('queryAll-text', result)

    result = await device.queryByTidAsync(tid);
    renderText('queryByTid-text', result)
}

function showLWAInfo() {
    const lwaInfo = ['name', 'version', 'description'];
    for (let key of lwaInfo) {
        document.querySelector('#lwa-' + key).innerText = config[key]
    }
    renderText('params-title', config.params.title)
}

function renderNetInfo() {
    renderNet(true);
    CoreAPI.getNotification().register(({event, msg}) => {
        switch (event) {
            case 'networkConnection':
                renderNet(!!msg);
                break;
        }
    })
}

async function lwaStart() {
    showLWAInfo()

    await CoreAPI.initAsync(host)

    renderNetInfo()

    await demoDatabase();
}

try {
    await lwaStart()
} catch (e) {
    console.log(e)
}
