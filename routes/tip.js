const router = require("express").Router()
const tipController = require("../controllers/tip.controller")

router.post("/", tipController.postTips)

module.exports = router
