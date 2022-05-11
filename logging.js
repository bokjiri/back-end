const winston = require("winston")
const WinstonDaily = require("winston-daily-rotate-file")
const path = require("path")
const { combine, timestamp, printf, colorize } = winston.format

const logDir = "logs"

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
}

winston.addColors(colors)

const level = () => {
    const env = process.env.NODE_ENV || "development"
    const isDevelopment = env === "development"
    return isDevelopment ? "debug" : "http"
}

const logFormat = combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    printf((info) => {
        if (info.stack) {
            return `${info.timestamp} ${info.level}: ${info.message} \n Error Stack: ${info.stack}`
        }
        return `${info.timestamp} ${info.level}: ${info.message}`
    })
)

const consoleOpts = {
    handleExceptions: true,
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    format: combine(colorize({ all: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" })),
}

const transports = [
    // 콘솔로그찍을 때만 색넣자.
    new winston.transports.Console(consoleOpts),
    // error 레벨 로그를 저장할 파일 설정
    new WinstonDaily({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: path.join(logDir, "/error"),
        filename: "%DATE%.error.log",
        maxFiles: 30,
        zippedArchive: true,
    }),
    // 모든 레벨 로그를 저장할 파일 설정
    new WinstonDaily({
        level: "debug",
        datePattern: "YYYY-MM-DD",
        dirname: path.join(logDir, "/all"),
        filename: "%DATE%.all.log",
        maxFiles: 7,
        zippedArchive: true,
    }),
]

const Logger = winston.createLogger({
    level: level(),
    levels,
    format: logFormat,
    transports,
})

const stream = {
    write: (message) => {
        Logger.info(message.substring(0, message.lastIndexOf("\n")))
    },
}

module.exports = { Logger, stream }
