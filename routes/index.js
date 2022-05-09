const router = require("express").Router()

const userRouter = require("./user")
const markRouter = require("./mark")
const tipRouter = require("./tip")
const mainRouter = require("./main")
const newsRouter = require("./news")
const detailRouter = require("./detail")
const searchRouter = require("./search")

router.use("/users", userRouter)
router.use("/marks", markRouter)
router.use("/tips", tipRouter)
router.use("/main", mainRouter)
router.use("/news", newsRouter)
router.use("/detail", detailRouter)
router.use("/search", searchRouter)

module.exports = router
