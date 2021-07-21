const methods = {};

methods.getAssets = require('./assets');
methods.getAssetHistory = require('./assethistory');
methods.setup = require('./net/ssh')

module.exports = methods;