const passport = require("passport")
const router = require("express").Router()
const authMiddleware = require("../middlewares/auth/auth.middleware")

const { kakaoCallback } = require("../controllers/user.controller")

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
module.exports = router
