const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CharUser', {
    charUserId: {
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
    charId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Char',
        key: 'charId'
      }
    }
  }, {
    sequelize,
    tableName: 'CharUser',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "charUserId" },
        ]
      },
      {
        name: "FK_Char_TO_CharUser_1",
        using: "BTREE",
        fields: [
          { name: "charId" },
        ]
      },
      {
        name: "FK_User_TO_CharUser_1",
        using: "BTREE",
        fields: [
          { name: "userCode" },
        ]
      },
    ]
  });
};
