import qs from 'qs';

let config, query;
if(process.env.NODE_ENV === 'development') {
  query = location.href.split("?")[1];
} else {
  query = location.search.split("?")[1];
}
let { params } = qs.parse(query);
if(params) {
  try {
    config = Object.assign({}, app_config.params, JSON.parse(params));
  } catch (e) {
    config = app_config.params
  }
} else {
  config = app_config.params
}

export {
  config
}
