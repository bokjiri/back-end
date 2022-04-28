const passport = require("passport")
const kakaoStrategy = require("../controllers/auth.controller")
const { findUser } = require("../services/user.service")

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        const { email } = user
        findUser(email)
            .then((user) => done(null, user))
            .catch((err) => done(err))
    })
    kakaoStrategy()
}
