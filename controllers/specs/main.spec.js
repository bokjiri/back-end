const mainController = require("../main.controller")
const httpMocks = require("node-mocks-http")
// const mainData = require("../../test/data/new-main.json")
jest.mock("../../schemas/user")
jest.mock("../../schemas/data")
const User = require("../../schemas/user")
const BokjiApi = require("../../schemas/data")
const request = require("request")
const userId = { userId: 1 }

let req, res
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
})

describe("메인 페이지 테스트", () => {
    describe("getMain API 테스트", () => {
        describe("필수 입력값 조회 테스트", () => {
            it("userId가 false로 들어오면 400과 응답값을 잘 리턴하는가?", async () => {
                req.params.userId = false
                await mainController.getMain(req, res)
                let userIdResult = { result: "Fail", code: -10, message: "필수 입력값 조회 실패" }

                expect(res.statusCode).toBe(400)
                expect(res._getJSONData()).toStrictEqual(userIdResult)
            })
        })
        describe("데이터베이스 조회 테스트", () => {
            it("UserId가 DB에 존재하지 않는다면 400과 응답값을 잘 리턴하는가?", async () => {
                req.params.userId = userId
                User.findOne.mockReturnValue(false)
                option = { _id: false, lifeCycle: true, target: true, obstacle: true }
                await mainController.getMain(req, res)
                let isUserResult = { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }
                expect(User.find).toBeCalledWith({ userId }, option)
                expect(res.statusCode).toBe(400)
                expect(res._getJSONData()).toStrictEqual(isUserResult)
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
