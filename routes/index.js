const router = require("express").Router()

const userRouter = require("../API/users")
const markRouter = require("../API/mark")
const tipRouter = require("../API/tip")
const newsRouter = require("../API/news")
const policyRouter = require("../API/policies")
const searchRouter = require("../API/search")
const mailRouter = require("../API/mail")
const guestbook = require("../API/guestbook")

router.use("/users", userRouter)
router.use("/marks", markRouter)
router.use("/tips", tipRouter)
router.use("/news", newsRouter)
router.use("/policies", policyRouter)
router.use("/search", searchRouter)
router.use("/mail", mailRouter)
router.use("/guestbooks", guestbook)

module.exports = router
