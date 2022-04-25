const router = require("express").Router()
const tipController = require("../controllers/tipController")

router.use("/", tipController.getTips)
router.use("/", tipController.postTips)
router.use("/:id", tipController.getDetailTips)
router.use("/:id", tipController.putDetailTips)
router.use("/:id", tipController.deleteDetailTips)

module.exports = router
