const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Data', {
    dataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    inqNum: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Data',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "dataId" },
        ]
      },
    ]
  });
};
