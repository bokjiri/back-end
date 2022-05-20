const router = require("express").Router()
const authMiddleware = require("../middlewares/auth/auth.middleware")
const { getDetail } = require("./controllers/detail.controller")

router.get("/:dataId", authMiddleware, getDetail)

module.exports = router
