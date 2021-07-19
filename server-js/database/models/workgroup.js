const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('workgroup', {
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
    tableName: 'workgroup',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "workgroup_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
