const router = require("express").Router()
const { getMain } = require("./controllers/policy.controller")
const { getDetail } = require("./controllers/policy.controller")
const authMiddleware = require("../../middlewares/auth/auth.middleware")

router.get("/:userId", authMiddleware, getMain)

router.get("/:dataId", authMiddleware, getDetail)

module.exports = router
