const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DesireData', {
    desireDataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    desireId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Desire',
        key: 'desireId'
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
    tableName: 'DesireData',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "desireDataId" },
        ]
      },
      {
        name: "FK_Data_TO_DesireData_1",
        using: "BTREE",
        fields: [
          { name: "dataId" },
        ]
      },
      {
        name: "FK_Desire_TO_DesireData_1",
        using: "BTREE",
        fields: [
          { name: "desireId" },
        ]
      },
    ]
  });
};
