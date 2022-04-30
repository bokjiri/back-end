const httpMocks = require("node-mocks-http")
const authController = require("./auth.middleware")
const emptyAuth = require("../../test/user/empty.json")
const incorrectAuth = require("../../test/user/incorrect.json")
const notBearerAuth = require("../../test/user/bearer.json")
const invalidAuth = require("../../test/user/invalid.json")

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
    // it("액세스 토큰검증 verifyToken이 실행되고 만료된 토큰인 경우 '액세스 토큰 만료'라는 메세지를 보내는가", async () => {
    //     verifyToken.mockReturnValue("jwt expired")

    //     console.log(verifyToken)
    //     expect(verifyToken).toBeCalledWith("액세스 토큰 만료")
    //     expect(res.statusCode).toBe(401)
    //     expect(res._getJSONData().message).toStrictEqual("액세스 토큰 만료")
    // })
    // it("만료된 토큰", async () => {
    //     const req = {
    //         headers: {
    //             authorization: "expiredToken",
    //         },
    //     }
    //     const error = { message: "jwt expired" }
    //     jwt.verify.mockImplementation(() => {
    //         throw error
    //     })
    //     authController(req, res, next)
    //     expect(res.statusCode).toBe(401)
    //     expect(res._getJSONData().message).toStrictEqual("액세스 토큰 만료")
    // })
})
