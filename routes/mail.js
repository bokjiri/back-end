const router = require("express").Router()
const { sendMail, certAuth } = require("../controllers/mail.controller")

router.post("/", sendMail)
router.post("/cert", certAuth)

module.exports = router
