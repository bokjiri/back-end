const router = require("express").Router()
const searchController = require("../controllers/search.controller")
const authMiddleware = require("../middlewares/auth/auth.middleware")

router.post("/", searchController.postSearch)

module.exports = router
