const router = require("express").Router()

const userRouter = require("./user")
const markRouter = require("./mark")
const tipRouter = require("./tip")
const mainRouter = require("./main")
const authRouter = require("./auth")
const newsRouter = require("./news")

router.use("/users", userRouter)
router.use("/marks", markRouter)
router.use("/tips", tipRouter)
router.use("/main", mainRouter)
router.use("/auth", authRouter)
router.use("/news", newsRouter)

module.exports = router
