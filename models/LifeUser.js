const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('LifeUser', {
    lifeUserId: {
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
    lifeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Life',
        key: 'lifeId'
      }
    }
  }, {
    sequelize,
    tableName: 'LifeUser',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "lifeUserId" },
        ]
      },
      {
        name: "FK_Life_TO_LifeUser_1",
        using: "BTREE",
        fields: [
          { name: "lifeId" },
        ]
      },
      {
        name: "FK_User_TO_LifeUser_1",
        using: "BTREE",
        fields: [
          { name: "userCode" },
        ]
      },
    ]
  });
};
