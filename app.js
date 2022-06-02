require("dotenv").config()
const { Logger, stream } = require("./logging")
const express = require("express")
const app = express()
const session = require("express-session")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const AWSXray = require("aws-xray-sdk")
const morgan = require("morgan")
const moment = require("moment-timezone")
moment.tz.setDefault("Asia/Seoul")
morgan.token("date", () => {
    return moment().format("YYYY-MM-DD HH:mm:ss:ms")
})
const connect = require("./schemas")
connect()
const passport = require("passport")
const passportConfig = require("./kakao/index")
const updateYouthApi = require("./openAPI/youthAPI/index")
const updateFirstBokjiApi = require("./openAPI/dataCleansing/data")
const dDayMail = require("./API/mark/services/mark.service")

const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("./swagger-output")

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile))
const corsOptions = {
    origin: ["http://localhost:3000", "https://boksei.com"],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(helmet())
app.use(morgan("common", { stream }))
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        cookie: {
            sameSite: "strict",
            httpOnly: true,
            secure: true,
        },
    })
)
app.use(AWSXray.express.openSegment("MyApp"))
passportConfig()
app.use(passport.initialize())
app.use(passport.session())
if (process.env.SCHEDULE) {
    updateFirstBokjiApi()
    updateYouthApi()
    // dDayMail.markPushMail()
}

const Router = require("./routes")
app.use("/api", Router)
app.use(AWSXray.express.closeSegment())

app.use((req, res, next) => {
    res.status(404).send("요청하신 페이지를 찾을 수 없습니다.")
})

app.use((err, req, res, next) => {
    Logger.error(`${err.message} \n ${err.stack ? err.stack : ""} `)
    res.status(err.status || 400).json({ result: "FAIL", message: err.message })
})

module.exports = app
