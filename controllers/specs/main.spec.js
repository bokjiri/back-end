const mainController = require("../main.controller")
const httpMocks = require("node-mocks-http")
// const mainData = require("../../test/data/new-main.json")
const mainService = require("../../services/main.service")
jest.mock("../../services/main.service")
// jest.mock("../../schemas/user")
// jest.mock("../../schemas/data")
// const User = require("../../schemas/user")
// const BokjiApi = require("../../schemas/data")
const userId = { userId: 2 }

let req, res, next, error
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn()
    mainService.checkUser.mockClear()
    mainService.checkData.mockClear()
})

describe("메인 페이지 테스트", () => {
    describe("getMain API 테스트", () => {
        describe("필수 입력값 조회 테스트", () => {
            it("userId가 false로 들어오면 400과 응답값을 잘 리턴하는가?", async () => {
                userIdResult = { result: "Fail", code: -10, message: "필수 입력값 조회 실패" }

                await mainController.getMain(req, res, next)
                expect(res.statusCode).toBe(400)
                expect(res._getJSONData()).toStrictEqual(userIdResult)
            })
        })
        describe("데이터베이스 조회 테스트", () => {
            it("UserId가 DB에 존재하지 않는다면 404과 응답값을 잘 리턴하는가?", async () => {
                req.params = userId
                isUserResult = { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }

                await mainController.getMain(req, res, next)
                expect(mainService.checkUser).toBeCalledWith(userId.userId)
                expect(res._getJSONData()).toStrictEqual(isUserResult)
                expect(res.statusCode).toBe(404)
            })
            // it("BokjiApi가 DB에 존재하지 않는다면 404과 응답값을 잘 리턴하는가?", async () => {
            //     req.params = userId
            //     isDataResult = { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }

            //     await mainController.getMain(req, res)
            //     expect(mainService.checkUser).toBeCalledWith(userId.userId)
            //     expect(res._getJSONData()).toStrictEqual(isDataResult)
            //     expect(res.statusCode).toBe(404)
            // })
        })
        describe("API 테스트", () => {
            // it("getMain이 200과 응답값을 잘 리턴하는가?", async () => {
            //     User.findOne.mockReturnValue(true)
            //     BokjiApi.find.mockReturnValue(true)
            //     await mainController.getMain(req, res)
            //     expect(res.statusCode).toBe(200)
            //     expect(res._getJSONData()).toStrictEqual({
            //         result: "SUCCESS",
            //         message: "메인 페이지 추천 정책 조회 성공",
            //         checkedData,
            //     })
            // })
        })
    })
})
