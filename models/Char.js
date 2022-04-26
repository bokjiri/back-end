const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Char', {
    charId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    specificity: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Char',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "charId" },
        ]
      },
    ]
  });
};
