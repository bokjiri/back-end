const router = require("express").Router()
const authController = require("../controllers/auth.controller")

router.use("/kakao", authController.getKakao)

module.exports = router
