const router = require("express").Router()
const { sendMail, certAuth } = require("./controllers/mail.controller")
const mailValidation = require("./validator/mail.validator")
const certValidation = require("./validator/cert.validator")

router.post("/send", mailValidation, sendMail)
router.post("/cert", certValidation, certAuth)

module.exports = router
