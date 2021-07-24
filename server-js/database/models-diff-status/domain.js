const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('domain', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'domain',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "domain_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
