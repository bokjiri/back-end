const mainController = require("./controllers/policy.controller")
const httpMocks = require("node-mocks-http")
// const mainData = require("../../test/data/new-main.json")
const mainService = require("./services/policy.service")
jest.mock("./services/main.service")
// jest.mock("../../schemas/user")
// jest.mock("../../schemas/data")
// const User = require("../../schemas/user")
// const BokjiApi = require("../../schemas/data")
const userId = { userId: 2 }
const request = require("supertest")
const app = require("../../app")
const mongoose = require("mongoose")
const User = require("../../schemas/user")
const Data = require("../../schemas/data")
const redis = require("../../schemas/redis")
const jwt = require("jsonwebtoken")
const sampleData = require("../../test/data/sample.json")

describe("detail 통합테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_detail?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await mongoose.connection.close()
        await mongoose.disconnect()
        await redis.quit()
    })
    describe("detail 통합테스트", () => {
        let Authorization, reAuthorization
        beforeAll(async () => {
            const email = "detail@email.com"
            const nickname = "detail"
            const password = "detail"
            await Data.create(sampleData)
            await request(app).post(`/api/users`).send({ email, nickname, password })
            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            Authorization = `Bearer ${res.body.accessToken}`
            reAuthorization = `Bearer ${res.body.accessToken}`
        })
        afterAll(async () => {
            await User.deleteMany()
            await Data.deleteMany()
        })
        it("get /api/detail/:dataId 잘됨?", async () => {
            const { dataId } = await Data.findOne()
            const res = await request(app).get(`/api/main/${dataId}`).set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(200)
        })
        it("get /api/detail/:dataId 토큰없이 안됨?", async () => {
            const { dataId } = await Data.findOne()
            const res = await request(app).get(`/api/detail/${dataId}`)
            expect(res.statusCode).toBe(401)
        })
    })
})

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
