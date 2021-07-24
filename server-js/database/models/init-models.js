var DataTypes = require("sequelize").DataTypes;
var _asset = require("./asset");
var _domain = require("./domain");
var _operating_system = require("./operating_system");
var _status = require("./status");
var _workgroup = require("./workgroup");

function initModels(sequelize) {
  var asset = _asset(sequelize, DataTypes);
  var domain = _domain(sequelize, DataTypes);
  var operating_system = _operating_system(sequelize, DataTypes);
  var status = _status(sequelize, DataTypes);
  var workgroup = _workgroup(sequelize, DataTypes);

  status.belongsTo(asset, { as: "asset", foreignKey: "asset_id"});
  asset.hasMany(status, { as: "statuses", foreignKey: "asset_id"});

  return {
    asset,
    domain,
    operating_system,
    status,
    workgroup,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
