const router = require("express").Router()
const { sendMail } = require("../controllers/mail.controller")

router.post("/", sendMail)

module.exports = router
