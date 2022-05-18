const mainController = require("../main.controller")
const httpMocks = require("node-mocks-http")
// const mainData = require("../../test/data/new-main.json")
jest.mock("../../schemas/user")
jest.mock("../../schemas/data")
const User = require("../../schemas/user")
const BokjiApi = require("../../schemas/data")
const userId = { userId: 1 }
const localsUserId = userId
const paramsUserId = userId

let req, res, next, error
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe("메인 페이지 테스트", () => {
    describe("getMain API 테스트", () => {
        describe("필수 입력값 조회 테스트", () => {
            it("userId가 false로 들어오면 400과 응답값을 잘 리턴하는가?", async () => {
                req.params.userId = false
                await mainController.getMain(req, res, next)
                let userIdResult = { result: "Fail", code: -10, message: "필수 입력값 조회 실패" }

                expect(res.statusCode).toBe(400)
                expect(res._getJSONData()).toStrictEqual(userIdResult)
            })
        })
        describe("데이터베이스 조회 테스트", () => {
            it("User find가 잘 실행이되나?", async () => {
                req.params = paramsUserId
                res.locals = localsUserId
                const option = { _id: false, __v: false, likeMark: false, email: false, nickname: false, profileUrl: false, topLikeMarkList: false }
                await mainController.getMain(req, res, next)
                expect(User.find).toBeCalledWith(localsUserId, option)
            })
            it("UserId가 DB에 존재하지 않는다면 400과 응답값을 잘 리턴하는가?", async () => {
                req.params.userId = userId
                User.findOne.mockReturnValue(false)
                option = { _id: false, lifeCycle: true, target: true, obstacle: true }
                await mainController.getMain(req, res, next)
                let isUserResult = { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }
                expect(User.find).toBeCalledWith({ userId }, option)
                expect(res.statusCode).toBe(400)
                expect(res._getJSONData()).toStrictEqual(isUserResult)
            })
            it("User find가 잘 실행이되나?", async () => {
                req.params = paramsUserId
                res.locals = localsUserId
                const option = { _id: false, mark: true }
                await markController.getMarks(req, res, next)
                expect(User.findOne).toBeCalledWith(localsUserId, option)
            })
            it("BokjiApi가 DB에 존재하지 않는다면 400과 응답값을 잘 리턴하는가?", async () => {
                req.params.userId = userId
                BokjiApi.find.mockReturnValue(false)
                const isDataResult = { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }
                await mainController.getMain(req, res)
                expect(res.statusCode).toBe(400)
                expect(res._getJSONData()).toStrictEqual(isDataResult)
            })
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
