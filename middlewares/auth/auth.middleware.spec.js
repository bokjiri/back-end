require("dotenv").config()
const httpMocks = require("node-mocks-http")
const authController = require("./auth.middleware")
const emptyAuth = require("../../test/user/empty.json")
const incorrectAuth = require("../../test/user/incorrect.json")
const notBearerAuth = require("../../test/user/bearer.json")
const invalidAuth = require("../../test/user/invalid.json")
const expiredAccessToken = require("../../test/user/expieredaccess.json")
jest.mock("../../users/services/user.service")
jest.mock("jsonwebtoken")
const jwt = require("jsonwebtoken")

let req, res
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn()
})
describe("auth.middleware test", () => {
    it("요청 헤더 내 authorization 값이 존재하지 않을 때 '요청 헤더 내 authorization 값이 존재하지 않습니다.'라는 메세지를 보내는가", async () => {
        req.headers = emptyAuth
        authController(req, res, next)
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData().message).toStrictEqual("요청 헤더 내 authorization 값이 존재하지 않습니다.")
    })

    it("요청 헤더 내 authorization 값이 올바르지 않을 때 '요청 헤더 내 authorization 값이 올바르지 않습니다.'라는 메세지를 보내는가", async () => {
        req.headers = incorrectAuth
        authController(req, res, next)
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData().message).toStrictEqual("요청 헤더 내 authorization 값이 올바르지 않습니다.")
    })
    it("토큰이 Bearer가 아닐 때 '토큰이 Bearer가 아니에요.'라는 메세지를 보내는가", async () => {
        req.headers = notBearerAuth
        authController(req, res, next)
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData().message).toStrictEqual("토큰이 Bearer가 아니에요.")
    })
    it("만료되었거나, 유효하지 않은 토큰일 경우 '만료되었거나, 유효하지 않은 토큰입니다.'라는 메세지를 보내는가", async () => {
        req.headers = invalidAuth
        authController(req, res, next)
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData().message).toStrictEqual("만료되었거나, 유효하지 않은 토큰입니다.")
    })
    // it("액세스 토큰이 만료된 토큰이고 리프레시 토큰이 유효한 경우 '액세스 토큰 재발행'이라는 메세지를 보내는가", async () => {
    //     const error = { name: "TokenExpiredError", message: "jwt expired" }
    //     const refreshToken = jwt.sign({ a: "a" }, process.env.REFRESHKEY, {
    //         expiresIn: process.env.RTOKENEXPIRE,
    //     })
    //     const reauthorization = `Bearer ${refreshToken}`
    //     console.log(reauthorization)
    //     req.headers = expiredAccessToken
    //     jwt.verify = jest
    //         .fn()
    //         .mockImplementationOnce(() => {
    //             throw error
    //         })
    //         .mockImplementationOnce(() => {
    //             throw { userId: 12, iat: 1651465544, exp: 11651465544 }
    //         })
    //     authController(req, res, next)
    //     console.log(jwt.verify.mock)
    //     expect(res.statusCode).toBe(401)
    //     expect(res._getJSONData().message).toStrictEqual("액세스 토큰 재발행")
    // })
    it("액세스 토큰과 리프레시 토큰이 모두 만료된 토큰인 경우 '리프레시 토큰 만료'이라는 메세지를 보내는가", async () => {
        const error = { name: "TokenExpiredError", message: "jwt expired" }
        const refreshToken = jwt.sign({}, process.env.REFRESHKEY, {
            expiresIn: process.env.RTOKENEXPIRE,
        })
        const reauthorization = `Bearer ${refreshToken}`
        req.headers = expiredAccessToken
        jwt.verify = jest.fn(() => {
            throw error
        })

        authController(req, res, next)
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData().message).toStrictEqual("리프레시 토큰 만료")
    })
})

// const { userId, nickname, profileUrl, email } = user
// const payload = { userId, nickname, profileUrl, email }
// const accessToken = jwt.sign(payload, process.env.ACCESSKEY, {
//     expiresIn: 0,
// })
// const refreshToken = jwt.sign({ userId }, process.env.REFRESHKEY, {
//     expiresIn: process.env.RTOKENEXPIRE,
// })
// const authorization = `Bearer ${accessToken}`
// const reauthorization = `Bearer ${refreshToken}`
// console.log(authorization)
// console.log(reauthorization)
// req.headers = { authorization, reauthorization }
// jest.mock("jsonwebtoken", () => {
//     return {
//         sign: jest.fn(() => "TOKEN"),
//         verify: jest.fn(() => ({ error: { name: "TokenExpiredError" } })),
//     }
// })
// jwt.verify = jest.fn(() => {
//     return Error({ name: "TokenExpiredError" })
// })
