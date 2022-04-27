const router = require("express").Router()
const tipController = require("../controllers/tip.controller")

router.use("/", tipController.postTips)

module.exports = router
