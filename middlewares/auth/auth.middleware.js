const jwt = require("jsonwebtoken")
const { checkById } = require("../../services/user.service")

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers

        if (!authorization)
            return res.status(401).json({
                result: "FAIL",
                message: "요청 헤더 내 authorization 값이 존재하지 않습니다.",
            })
        if (authorization.split(" ").length !== 2)
            return res.status(401).json({
                result: "FAIL",
                message: "요청 헤더 내 authorization 값이 올바르지 않습니다.",
            })

        const [tokenType, tokenValue] = authorization.split(" ")

        if (tokenType !== "Bearer")
            return res.status(401).json({
                result: "FAIL",
                message: "토큰이 Bearer가 아니에요.",
            })
        const aToken = jwt.verify(tokenValue, process.env.ACCESSKEY)

        const confirmUser = await checkById(aToken.userId)

        if (!confirmUser) throw new Error()
        res.locals.userId = confirmUser.userId
        res.locals.email = confirmUser.email
        res.locals.nickname = confirmUser.nickname
        res.locals.profileUrl = confirmUser.profileUrl

        next()
    } catch (error) {
        try {
            if (error.name === "TokenExpiredError") {
                const { authorization, reauthorization } = req.headers
                const [tokenType, tokenValue] = authorization.split(" ")
                const [rTokenType, rTokenValue] = reauthorization.split(" ")
                if (tokenType !== "Bearer" && rTokenType !== "Bearer")
                    return res.status(401).json({
                        result: "FAIL",
                        message: "토큰이 Bearer가 아니에요.",
                    })
                const rToken = jwt.verify(rTokenValue, process.env.REFRESHKEY)
                const aTokenDecode = jwt.decode(tokenValue)
                if (aTokenDecode.userId !== rToken.userId) {
                    throw new Error()
                }
                const confirmUser = await checkById(aTokenDecode.userId)
                const { userId, nickname, profileUrl, email } = confirmUser
                const payload = { userId, nickname, profileUrl, email }
                const accessToken = jwt.sign(payload, process.env.ACCESSKEY, {
                    expiresIn: process.env.ATOKENEXPIRE,
                })
                return res.status(401).json({
                    result: "SUCCESS",
                    message: "액세스 토큰 재발행",
                    accessToken,
                })
            }
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    result: "FAIL",
                    message: "리프레시 토큰 만료",
                    reason: "refreshToken expired",
                })
            } else {
                return res.status(401).json({
                    result: "FAIL",
                    message: "만료되었거나, 유효하지 않은 토큰입니다.",
                })
            }
        }
        return res.status(401).json({
            result: "FAIL",
            message: "만료되었거나, 유효하지 않은 토큰입니다.",
        })
    }
}
