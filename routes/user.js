const express = require("express")
const passport = require("passport")
const router = express.Router()
const jwt = require("jsonwebtoken")

router.get("/kakao", passport.authenticate("kakao"))

router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/",
    }),
    async (req, res) => {
        const { user } = req.session.passport
        const { userId, nicname, profileUrl } = user
        const payload = { userId, nicname, profileUrl }
        const accessToken = jwt.sign(payload, process.env.ACCESSKEY, {
            expiresIn: process.env.ATOKENEXPIRE,
        })
        const refreshToken = jwt.sign({ email: user }, process.env.REFRESHKEY, {
            expiresIn: process.env.RTOKENEXPIRE,
        })
        res.cookie("ACCESS_TOKEN", accessToken, {
            sameSite: "None",
            httpOnly: true,
            secure: true,
        })
            .cookie("REFRESH_TOKEN", refreshToken, {
                sameSite: "None",
                httpOnly: true,
                secure: true,
            })
            .redirect("http://localhost:3000")
    }
)
module.exports = router
