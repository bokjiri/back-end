const router = require("express").Router()
const { getDetail } = require("./controllers/detail.controller")
const tokenMiddleware = require("../../middlewares/token.middleware")

router.get("/:dataId", tokenMiddleware, getDetail)

module.exports = router
