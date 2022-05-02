const passport = require("passport")
const router = require("express").Router()
const authMiddleware = require("../middlewares/auth/auth.middleware")

const { kakaoCallback, getUsers, putUsers, deleteUsers } = require("../controllers/user.controller")

router.get("/me", authMiddleware, (req, res) => {
    res.send({})
})
router.get("/kakao", passport.authenticate("kakao"))

router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/",
    }),
    kakaoCallback
)
router.get("/:userId", authMiddleware, getUsers)
router.put("/:userId", authMiddleware, putUsers)
router.delete("/:userId", authMiddleware, deleteUsers)

module.exports = router
