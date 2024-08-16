import config from '../../public/config.json';

function parse(str) {
    if(!str || !str.length) return {};
    return str.split("&").reduce((acc, row) => {
        const [k, v] = row.split('=').map(decodeURIComponent);
        acc[k] = v;
        return acc;
    }, {});
}

if (typeof window !== 'undefined') {
    let query = location.href.split("?")[1];
    let { params } = parse(query);
    try {
        if (params) config.params = {...config.params, ...JSON.parse(params)};
    } catch (e) {
        console.error(e);
    }
}

export { config }
