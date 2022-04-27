const jwt = require("jsonwebtoken")
const { Users } = require("../../models")

module.exports = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization)
        return res.status(401).json({
            result: "FAIL",
            code: -1,
            message: "요청 헤더 내 authorization 값이 존재하지 않습니다.",
        })
    if (authorization.split(" ").length !== 2)
        return res.status(401).json({
            result: "FAIL",
            code: -2,
            message: "요청 헤더 내 authorization 값이 올바르지 않습니다.",
        })

    const [tokenType, tokenValue] = authorization.split(" ")
    if (tokenType !== "Bearer")
        return res.status(401).json({
            result: "FAIL",
            code: -10,
            message: "로그인 후 사용하세요",
        })

    try {
        const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY)
        const findUser = await Users.findOne({ where: { userId } })

        // payload 내 아이디가 DB 내 존재하지 않는다면, 에러를 발생시킨다.
        if (!findUser) return new Error()
        res.locals.user = findUser

        next()
    } catch (err) {
        return res.status(401).json({
            result: "FAIL",
            code: -20,
            message: "만료되었거나, 유효하지 않은 토큰입니다.",
        })
    }
}
