const passport = require("passport")
const router = require("express").Router()
const authMiddleware = require("../middlewares/auth/auth.middleware")
const userValidation = require("../validator/user.validator")

const { kakaoCallback, getUsers, patchUsers, deleteUsers } = require("../controllers/user.controller")

router.get("/kakao", passport.authenticate("kakao"))

router.get(
    "/kakao/callback",
    passport.authenticate("kakao", {
        failureRedirect: "/",
    }),
    kakaoCallback
)
router.get("/:userId", authMiddleware, getUsers)
router.patch("/:userId", authMiddleware, userValidation, patchUsers)
router.delete("/:userId", authMiddleware, deleteUsers)

module.exports = router
