const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Trgter', {
    trgterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    target: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Trgter',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "trgterId" },
        ]
      },
    ]
  });
};
