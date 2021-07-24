const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('operating_system', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    build: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    architecture: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'operating_system',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "operating_system_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
