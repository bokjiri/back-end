const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ObstData', {
    obstDataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    obstId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Obst',
        key: 'obstId'
      }
    },
    dataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Data',
        key: 'dataId'
      }
    }
  }, {
    sequelize,
    tableName: 'ObstData',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "obstDataId" },
        ]
      },
      {
        name: "FK_Data_TO_ObstData_1",
        using: "BTREE",
        fields: [
          { name: "dataId" },
        ]
      },
      {
        name: "FK_Obst_TO_ObstData_1",
        using: "BTREE",
        fields: [
          { name: "obstId" },
        ]
      },
    ]
  });
};
