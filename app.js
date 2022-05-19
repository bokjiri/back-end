require("dotenv").config()
const { Logger, stream } = require("./logging")
const express = require("express")
const app = express()
const session = require("express-session")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const morgan = require("morgan")
const connect = require("./schemas")
const passport = require("passport")
const passportConfig = require("./kakao/index")
const { newsData } = require("./services/news.service")
const updateYouthApi = require("./dataUpdating/index")
const updateFirstBokjiApi = require("./dataCleansing/data")

connect()
// const whitelist = ["http://localhost:3000"]
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error("Not Allowed Origin!"))
//         }
//     },
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true,
// }
// app.use(cors(corsOptions))

const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("./swagger-output")

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile))

const corsOptions = {
    origin: ["http://localhost:3000", "https://boksei.com"],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(morgan("common", { stream }))
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.disable("x-powered-by")
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        cookie: {
            httpOnly: true,
            secure: true,
        },
    })
)
passportConfig()
app.use(passport.initialize())
app.use(passport.session())
if (process.env.SCHEDULE) {
    updateFirstBokjiApi()
    updateYouthApi()
    newsData()
}

const Router = require("./routes")
app.use("/api", Router)

app.use((req, res, next) => {
    res.status(404).send("요청하신 페이지를 찾을 수 없습니다.")
})

app.use((err, req, res, next) => {
    Logger.error(`${err.message} \n ${err.stack ? err.stack : ""} `)
    res.status(400).json({ result: "FAIL", message: err.message })
})

module.exports = app
