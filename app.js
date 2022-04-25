require("dotenv").config()
const express = require("express")
const app = express()
const session = require("express-session")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const morgan = require("morgan")

const whitelist = ["http://localhost:3000"]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not Allowed Origin!"))
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
}
app.use(cors(corsOptions))

app.use(morgan("dev"))

// const swaggerUi = require("swagger-ui-express")
// const swaggerFile = require("./swagger-output")

// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.disable("x-powered-by")
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
    })
)

const Router = require("./routes")
app.use("/api", Router)

app.use((req, res, next) => {
    res.status(404).send("요청하신 페이지를 찾을 수 없습니다.")
})

app.use((err, req, res, next) => {
    res.json({ result: false, message: err.message })
})

module.exports = app
