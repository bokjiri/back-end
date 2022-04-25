const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const redis = require('../../config/redis');

router.get('/kakao', passport.authenticate('kakao'));

router.get(
    '/kakao/callback',
    passport.authenticate('kakao', {
        failureRedirect: '/',
    }),
    async (req, res) => {
        const { user } = req.session.passport;
        const agent = req.headers['user-agent'];
        const nickname = await User.findOne({
            where: { email: user },
            attributes: ['nickname', 'userId'],
        });
        const payload = {
            userId: nickname.userId,
            nickname: nickname.nickname,
        };
        const accessToken = jwt.sign(payload, process.env.ACCESSKEY, {
            expiresIn: process.env.ATOKENEXPIRE,
        });
        const refreshToken = jwt.sign({ email: user }, process.env.REFRESHKEY, {
            expiresIn: process.env.RTOKENEXPIRE,
        });
        const key = user.userId + agent;
        await redis.set(key, refreshToken);
        res.cookie('ACCESS_TOKEN', accessToken, {
            sameSite: 'None',
            httpOnly: true,
            secure: true,
        });
        res.cookie('REFRESH_TOKEN', refreshToken, {
            sameSite: 'None',
            httpOnly: true,
            secure: true,
        });
        // res.header('ACCESS_TOKEN', accessToken);
        // res.header('REFRESH_TOKEN', refreshToken);
        // res.header('email', user);
        // res.header('nickname', nickname.nickname);
        // res.header('userId', nickname.userId);
        res.redirect(
            'http://ud.dicegame.react.s3-website.ap-northeast-2.amazonaws.com/'
        );
    }
);
module.exports = router;
