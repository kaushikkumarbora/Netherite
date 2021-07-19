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
  asset.belongsTo(domain, { as: "domain", foreignKey: "domain_id"});
  domain.hasMany(asset, { as: "assets", foreignKey: "domain_id"});
  asset.belongsTo(operating_system, { as: "o", foreignKey: "os_id"});
  operating_system.hasMany(asset, { as: "assets", foreignKey: "os_id"});
  asset.belongsTo(workgroup, { as: "workgroup", foreignKey: "workgroup_id"});
  workgroup.hasMany(asset, { as: "assets", foreignKey: "workgroup_id"});

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
