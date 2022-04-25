const router = require("express").Router()

const kakao = require("../login.kakao/routes/auth")

router.use("/auth", kakao)

module.exports = router
