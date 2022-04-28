const router = require("express").Router()
const markController = require("../controllers/mark.controller")

router.get("/", markController.getMarks)
router.use("/", markController.postMarks)
router.use("/", markController.deleteMarks)

module.exports = router
