const app = require("./app")
const https = require("https")
const http = require("http")
let server = ""

server = https.createServer(app)

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "https://boksei.com"],
        credentials: true,
    },
})

io.on("connection", (socket) => {
    socket.on("reqMSG", (msg) => {
        io.emit("resMSG", msg)
    })

    socket.on("disconnect", () => {
        console.log("disconnect socketId : ", socket.id)
    })
})

module.exports = { server }
