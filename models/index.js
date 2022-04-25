const initModels = require("./init-models") // init-models.js에서 메서드를 가져온다.
const { Sequelize } = require("sequelize")
// config/config.json 파일에 있는 설정값들을 불러온다.
// config객체의 env변수(development)키 의 객체값들을 불러온다.
// 즉, 데이터베이스 설정을 불러온다고 말할 수 있다.
const env = process.env.NODE_ENV || "development"
const config = require("../config/config.json")[env]
// new Sequelize를 통해 MySQL 연결 객체를 생성한다.
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
)
// 모델과 테이블간의 관계가 맺어진다.
const models = initModels(sequelize)
module.exports = models
