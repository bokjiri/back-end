const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Life', {
    lifeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ageGroup: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Life',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "lifeId" },
        ]
      },
    ]
  });
};
