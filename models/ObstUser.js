const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ObstUser', {
    obstUserId: {
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
    obstId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Obst',
        key: 'obstId'
      }
    }
  }, {
    sequelize,
    tableName: 'ObstUser',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "obstUserId" },
        ]
      },
      {
        name: "FK_Obst_TO_ObstUser_1",
        using: "BTREE",
        fields: [
          { name: "obstId" },
        ]
      },
      {
        name: "FK_User_TO_ObstUser_1",
        using: "BTREE",
        fields: [
          { name: "userCode" },
        ]
      },
    ]
  });
};
