const methods = {};

methods.getAssets = require('./assets');
methods.getAssetHistory = require('./assethistory');
methods.setup_lin = require('./net/ssh-linux');
methods.setup_win = require('./net/ssh-windows');

module.exports = methods;