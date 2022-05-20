const router = require("express").Router()

const userRouter = require("../users")
const markRouter = require("../mark")
const tipRouter = require("../tip")
const mainRouter = require("./main")
const newsRouter = require("../news")
const policyRouter = require("../policies")
const searchRouter = require("../search")
const mailRouter = require("../mail")

router.use("/users", userRouter)
router.use("/marks", markRouter)
router.use("/tips", tipRouter)
router.use("/main", mainRouter)
router.use("/news", newsRouter)
router.use("/detail", policyRouter)
router.use("/search", searchRouter)
router.use("/mail", mailRouter)

module.exports = router
