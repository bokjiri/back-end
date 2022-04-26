var DataTypes = require("sequelize").DataTypes;
var _Char = require("./Char");
var _CharData = require("./CharData");
var _CharUser = require("./CharUser");
var _Data = require("./Data");
var _Desire = require("./Desire");
var _DesireData = require("./DesireData");
var _Life = require("./Life");
var _LifeData = require("./LifeData");
var _LifeUser = require("./LifeUser");
var _Mark = require("./Mark");
var _Obst = require("./Obst");
var _ObstData = require("./ObstData");
var _ObstUser = require("./ObstUser");
var _Tip = require("./Tip");
var _Trgter = require("./Trgter");
var _TrgterData = require("./TrgterData");
var _TrgterUser = require("./TrgterUser");
var _User = require("./User");

function initModels(sequelize) {
  var Char = _Char(sequelize, DataTypes);
  var CharData = _CharData(sequelize, DataTypes);
  var CharUser = _CharUser(sequelize, DataTypes);
  var Data = _Data(sequelize, DataTypes);
  var Desire = _Desire(sequelize, DataTypes);
  var DesireData = _DesireData(sequelize, DataTypes);
  var Life = _Life(sequelize, DataTypes);
  var LifeData = _LifeData(sequelize, DataTypes);
  var LifeUser = _LifeUser(sequelize, DataTypes);
  var Mark = _Mark(sequelize, DataTypes);
  var Obst = _Obst(sequelize, DataTypes);
  var ObstData = _ObstData(sequelize, DataTypes);
  var ObstUser = _ObstUser(sequelize, DataTypes);
  var Tip = _Tip(sequelize, DataTypes);
  var Trgter = _Trgter(sequelize, DataTypes);
  var TrgterData = _TrgterData(sequelize, DataTypes);
  var TrgterUser = _TrgterUser(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  CharData.belongsTo(Char, { as: "char", foreignKey: "charId"});
  Char.hasMany(CharData, { as: "CharData", foreignKey: "charId"});
  CharUser.belongsTo(Char, { as: "char", foreignKey: "charId"});
  Char.hasMany(CharUser, { as: "CharUsers", foreignKey: "charId"});
  CharData.belongsTo(Data, { as: "datum", foreignKey: "dataId"});
  Data.hasMany(CharData, { as: "CharData", foreignKey: "dataId"});
  DesireData.belongsTo(Data, { as: "datum", foreignKey: "dataId"});
  Data.hasMany(DesireData, { as: "DesireData", foreignKey: "dataId"});
  LifeData.belongsTo(Data, { as: "datum", foreignKey: "dataId"});
  Data.hasMany(LifeData, { as: "LifeData", foreignKey: "dataId"});
  Mark.belongsTo(Data, { as: "datum", foreignKey: "dataId"});
  Data.hasMany(Mark, { as: "Marks", foreignKey: "dataId"});
  ObstData.belongsTo(Data, { as: "datum", foreignKey: "dataId"});
  Data.hasMany(ObstData, { as: "ObstData", foreignKey: "dataId"});
  TrgterData.belongsTo(Data, { as: "datum", foreignKey: "dataId"});
  Data.hasMany(TrgterData, { as: "TrgterData", foreignKey: "dataId"});
  DesireData.belongsTo(Desire, { as: "desire", foreignKey: "desireId"});
  Desire.hasMany(DesireData, { as: "DesireData", foreignKey: "desireId"});
  LifeData.belongsTo(Life, { as: "life", foreignKey: "lifeId"});
  Life.hasMany(LifeData, { as: "LifeData", foreignKey: "lifeId"});
  LifeUser.belongsTo(Life, { as: "life", foreignKey: "lifeId"});
  Life.hasMany(LifeUser, { as: "LifeUsers", foreignKey: "lifeId"});
  ObstData.belongsTo(Obst, { as: "obst", foreignKey: "obstId"});
  Obst.hasMany(ObstData, { as: "ObstData", foreignKey: "obstId"});
  ObstUser.belongsTo(Obst, { as: "obst", foreignKey: "obstId"});
  Obst.hasMany(ObstUser, { as: "ObstUsers", foreignKey: "obstId"});
  TrgterData.belongsTo(Trgter, { as: "trgter", foreignKey: "trgterId"});
  Trgter.hasMany(TrgterData, { as: "TrgterData", foreignKey: "trgterId"});
  TrgterUser.belongsTo(Trgter, { as: "trgter", foreignKey: "trgterId"});
  Trgter.hasMany(TrgterUser, { as: "TrgterUsers", foreignKey: "trgterId"});
  CharUser.belongsTo(User, { as: "userCode_User", foreignKey: "userCode"});
  User.hasMany(CharUser, { as: "CharUsers", foreignKey: "userCode"});
  LifeUser.belongsTo(User, { as: "userCode_User", foreignKey: "userCode"});
  User.hasMany(LifeUser, { as: "LifeUsers", foreignKey: "userCode"});
  Mark.belongsTo(User, { as: "userCode_User", foreignKey: "userCode"});
  User.hasMany(Mark, { as: "Marks", foreignKey: "userCode"});
  ObstUser.belongsTo(User, { as: "userCode_User", foreignKey: "userCode"});
  User.hasMany(ObstUser, { as: "ObstUsers", foreignKey: "userCode"});
  Tip.belongsTo(User, { as: "userCode_User", foreignKey: "userCode"});
  User.hasMany(Tip, { as: "Tips", foreignKey: "userCode"});
  TrgterUser.belongsTo(User, { as: "userCode_User", foreignKey: "userCode"});
  User.hasMany(TrgterUser, { as: "TrgterUsers", foreignKey: "userCode"});

  return {
    Char,
    CharData,
    CharUser,
    Data,
    Desire,
    DesireData,
    Life,
    LifeData,
    LifeUser,
    Mark,
    Obst,
    ObstData,
    ObstUser,
    Tip,
    Trgter,
    TrgterData,
    TrgterUser,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
