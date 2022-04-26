const router = require("express").Router()
const authController = require("../controllers/authController")

router.use("/kakao", authController.getKakao)

module.exports = router
