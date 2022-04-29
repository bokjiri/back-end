const router = require("express").Router()
const markController = require("../controllers/mark.controller")

router.get("/:userId", markController.getMarks)
router.put("/:userId", markController.postMarks)
router.delete("/:userId", markController.deleteMarks)

module.exports = router
