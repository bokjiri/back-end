const passport = require("passport")
const router = require("express").Router()
const authMiddleware = require("../../middlewares/auth/auth.middleware")
const userValidation = require("./validators/user.validator")

const { kakaoCallback, getUsers, patchUsers, deleteUsers, createUser, authUser } = require("./controllers/user.controller")

router.post("/", createUser)
router.post("/auth", authUser)
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
