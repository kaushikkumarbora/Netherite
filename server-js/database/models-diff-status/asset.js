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
    workgroup_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'workgroup',
        key: 'id'
      }
    },
    domain_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'domain',
        key: 'id'
      }
    },
    ip: {
      type: "INET",
      allowNull: false,
      unique: "asset_u_ip"
    },
    os_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'operating_system',
        key: 'id'
      }
    },
    latest_status: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'status',
        key: 'id'
      }
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
