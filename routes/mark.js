const router = require("express").Router()
const markController = require("../controllers/markController")

router.use("/", markController.getMarks)

module.exports = router
