const router = require("express").Router()
const tipController = require("./controllers/tip.controller")
const authMiddleware = require("../middlewares/auth/auth.middleware")

router.post("/", authMiddleware, tipController.postTips)

module.exports = router
