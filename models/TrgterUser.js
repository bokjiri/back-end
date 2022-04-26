const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TrgterUser', {
    trgterUserId: {
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
    trgterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trgter',
        key: 'trgterId'
      }
    }
  }, {
    sequelize,
    tableName: 'TrgterUser',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "trgterUserId" },
        ]
      },
      {
        name: "FK_Trgter_TO_TrgterUser_1",
        using: "BTREE",
        fields: [
          { name: "trgterId" },
        ]
      },
      {
        name: "FK_User_TO_TrgterUser_1",
        using: "BTREE",
        fields: [
          { name: "userCode" },
        ]
      },
    ]
  });
};
