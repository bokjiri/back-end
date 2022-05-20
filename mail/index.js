const router = require("express").Router()
const { sendMail, certAuth } = require("./controllers/mail.controller")
const mailValidation = require("./validator/mail.validatior")

router.post("/", mailValidation, sendMail)
router.post("/cert", certAuth)

module.exports = router
