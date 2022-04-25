const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../models');
const Inko = require('inko');
const inko = new Inko();
const bcrypt = require('bcrypt');

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: process.env.KAKAO_ID,
                callbackURL: '/api/auth/kakao/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const kakaoEmail = inko.ko2en(profile.username);
                    const exUser = await User.findOne({
                        where: {
                            email: `${kakaoEmail}@kakao.com`,
                        },
                    });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const kakaoEmail = inko.ko2en(profile.username);
                        const kakaoNickname = inko.ko2en(profile.username);
                        const password = Math.random()
                            .toString(36)
                            .substring(2, 11);
                        const hashedPwd = await bcrypt.hashSync(password, 10);
                        const newUser = await User.create({
                            email: `${kakaoEmail}@kakao.com`,
                            nickname: kakaoNickname,
                            password: hashedPwd,
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};
