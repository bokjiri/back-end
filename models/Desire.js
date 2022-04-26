const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Desire', {
    desireId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Desire',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "desireId" },
        ]
      },
    ]
  });
};
