const passport = require("passport")
const router = require("express").Router()

const { kakaoCallback } = require("../controllers/user.controller")

router.get("/kakao", passport.authenticate("kakao"))

router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/",
    }),
    kakaoCallback
)
module.exports = router
