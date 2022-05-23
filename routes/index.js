const router = require("express").Router()

const userRouter = require("../API/users")
const markRouter = require("../API/mark")
const tipRouter = require("../API/tip")
const mainRouter = require("../main")
const newsRouter = require("../API/news")
const policyRouter = require("../API/policies")
const searchRouter = require("../API/search")
const mailRouter = require("../API/mail")

router.use("/users", userRouter)
router.use("/marks", markRouter)
router.use("/tips", tipRouter)
router.use("/main", mainRouter)
router.use("/news", newsRouter)
router.use("/detail", policyRouter)
router.use("/search", searchRouter)
router.use("/mail", mailRouter)

module.exports = router
