const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const operaciones = require('./operaciones');

module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...operaciones
};