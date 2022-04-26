const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Mark', {
    markId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'userCode'
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
    tableName: 'Mark',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "markId" },
        ]
      },
      {
        name: "FK_Data_TO_Mark_1",
        using: "BTREE",
        fields: [
          { name: "dataId" },
        ]
      },
      {
        name: "FK_User_TO_Mark_1",
        using: "BTREE",
        fields: [
          { name: "userCode" },
        ]
      },
    ]
  });
};
