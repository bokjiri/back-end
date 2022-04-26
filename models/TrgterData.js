const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TrgterData', {
    trgterDataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    trgterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trgter',
        key: 'trgterId'
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
    tableName: 'TrgterData',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "trgterDataId" },
        ]
      },
      {
        name: "FK_Data_TO_TrgterData_1",
        using: "BTREE",
        fields: [
          { name: "dataId" },
        ]
      },
      {
        name: "FK_Trgter_TO_TrgterData_1",
        using: "BTREE",
        fields: [
          { name: "trgterId" },
        ]
      },
    ]
  });
};
