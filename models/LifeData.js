const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LifeData', {
    lifeDataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    lifeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Life',
        key: 'lifeId'
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
    tableName: 'LifeData',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "lifeDataId" },
        ]
      },
      {
        name: "FK_Data_TO_LifeData_1",
        using: "BTREE",
        fields: [
          { name: "dataId" },
        ]
      },
      {
        name: "FK_Life_TO_LifeData_1",
        using: "BTREE",
        fields: [
          { name: "lifeId" },
        ]
      },
    ]
  });
};
