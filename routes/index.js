const router = require("express").Router()

const userRouter = require("./user")
const markRouter = require("./mark")
const tipRouter = require("./tip")
const mainRouter = require("./main")

router.use("/users", userRouter)
router.use("/marks", markRouter)
router.use("/tips", tipRouter)
router.use("/main", mainRouter)


module.exports = router
