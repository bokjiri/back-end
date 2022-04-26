const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Tip', {
    tipId: {
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Tip',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tipId" },
        ]
      },
      {
        name: "FK_User_TO_Tip_1",
        using: "BTREE",
        fields: [
          { name: "userCode" },
        ]
      },
    ]
  });
};
