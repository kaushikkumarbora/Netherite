const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asset', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    hostname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "asset_u_hostname"
    },
    mac: {
      type: "MACADDR",
      allowNull: false,
      unique: "asset_u_mac"
    },
    ip: {
      type: "INET",
      allowNull: false,
      unique: "asset_u_ip"
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    os: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    domain: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    workgroup: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    os_ver: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'asset',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "asset_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "asset_u_hostname",
        unique: true,
        fields: [
          { name: "hostname" },
        ]
      },
      {
        name: "asset_u_ip",
        unique: true,
        fields: [
          { name: "ip" },
        ]
      },
      {
        name: "asset_u_mac",
        unique: true,
        fields: [
          { name: "mac" },
        ]
      },
    ]
  });
};
