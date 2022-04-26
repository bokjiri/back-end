const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CharData', {
    charDataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    charId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Char',
        key: 'charId'
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
    tableName: 'CharData',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "charDataId" },
        ]
      },
      {
        name: "FK_Char_TO_CharData_1",
        using: "BTREE",
        fields: [
          { name: "charId" },
        ]
      },
      {
        name: "FK_Data_TO_CharData_1",
        using: "BTREE",
        fields: [
          { name: "dataId" },
        ]
      },
    ]
  });
};
