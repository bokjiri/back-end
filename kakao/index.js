const passport = require("passport")
const kakaoStrategy = require("./strategy")
const { checkByEmail } = require("../API/users/services/user.service")

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        const { email } = user
        checkByEmail(email)
            .then((user) => done(null, user))
            .catch((err) => done(err))
    })
    kakaoStrategy()
}
