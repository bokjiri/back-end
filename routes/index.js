const router = require("express").Router()

const userRouter = require("../API/users")
const markRouter = require("../API/mark")
const tipRouter = require("../API/tip")
const policyRouter = require("../API/policies")
const newsRouter = require("../API/news")
const searchRouter = require("../API/search")
const mailRouter = require("../API/mail")

router.use("/users", userRouter)
router.use("/marks", markRouter)
router.use("/tips", tipRouter)
router.use("/policy", policyRouter)
router.use("/news", newsRouter)
router.use("/search", searchRouter)
router.use("/mail", mailRouter)

module.exports = router
