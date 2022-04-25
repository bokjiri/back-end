const passport = require('passport');
const kakaoStrategy = require('./kakao.strategy');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((email, done) => {
        User.findOne({ where: { email } })
            .then((user) => done(null, user))
            .catch((err) => done(err));
    });
    kakaoStrategy();
};
