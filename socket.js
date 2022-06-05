const app = require("./app")
const fs = require("fs")
const https = require("https")
const http = require("http")
const User = require("./schemas/user")
const Chat = require("./schemas/chat")
let server = ""

const Domain = process.env.RLADOMAIN || process.env.DOMAIN

if (process.env.PORT) {
    const privateKey = fs.readFileSync(`/etc/letsencrypt/live/${Domain}/privkey.pem`, "utf8")
    const certuficate = fs.readFileSync(`/etc/letsencrypt/live/${Domain}/cert.pem`, "utf8")
    const ca = fs.readFileSync(`/etc/letsencrypt/live/${Domain}/chain.pem`, "utf8")

    const credentials = {
        key: privateKey,
        cert: certuficate,
        ca: ca,
    }
    server = https.createServer(credentials, app)
} else {
    server = http.createServer(app)
}

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "https://boksei.com"],
        credentials: true,
    },
})

io.on("connection", (socket) => {
    socket.on("chatRoom", async (userId) => {
        const chatList = await Chat.find({ userId }, { _id: false, __v: false })
        io.emit("chatList", chatList)
    })
    socket.on("reqMessage", async (msg, userId) => {
        try {
            // console.log("msg: " + msg, "userId: " + userId)
            const checkUser = await User.findOne({ userId })

            if (checkUser) {
                const nickname = checkUser.nickname
                const profileImg = checkUser.profileUrl
                const chatMessage = {
                    userId,
                    nickname: checkUser.nickname,
                    profileImg: checkUser.profileUrl,
                    message: msg,
                }
                io.emit("chatMessage", chatMessage)
                await Chat.create({ userId, nickname, profileImg, message: msg })
            }
        } catch (err) {
            console.log(err)
        }
    })

    socket.on("disconnect", () => {
        console.log("disconnect socketId : ", socket.id)
    })
})

module.exports = { server }
