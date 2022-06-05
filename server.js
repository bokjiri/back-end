const port = process.env.PORT || 3000
const { server } = require("./socket")

server.listen(port, () => {
    process.send("ready")
    console.log(port, "번으로 서버가 연결되었습니다.")
    console.log(`http://localhost:${port}`)
})
process.on("SIGINT", () => {
    server.close(() => {
        console.log("server closed")
        process.exit(0)
    })
})
