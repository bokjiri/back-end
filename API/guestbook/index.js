const router = require("express").Router()
const guestbookController = require("./controllers/guestbook.controller")
const authMiddleware = require("../../middlewares/auth/auth.middleware")

router.get("/", authMiddleware, guestbookController.getGuestbook)
router.post("/", authMiddleware, guestbookController.postFeed)
router.put("/:feedId", authMiddleware, guestbookController.putFeed)
router.delete("/:feedId", authMiddleware, guestbookController.deleteFeed)
router.patch("/:feedId", authMiddleware, guestbookController.postReportFeed)

module.exports = router
