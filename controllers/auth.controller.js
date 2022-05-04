const passport = require("passport")
const KakaoStrategy = require("passport-kakao").Strategy
const { createUser, checkByEmail } = require("../services/user.service")

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: process.env.KAKAO_CALLBACK,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const { email } = profile._json.kakao_account
                    const exUser = await checkByEmail(email)
                    if (exUser === undefined) {
                        const email = profile._json.kakao_account.email
                        const nickname = profile.displayName
                        const profileUrl = profile._json.kakao_account.profile.profile_image_url
                        const newUser = await createUser(email, nickname, profileUrl)
                        done(null, newUser)
                    } else {
                        done(null, exUser)
                    }
                } catch (error) {
                    console.error(error)
                    done(error)
                }
            }
        )
    )
}
