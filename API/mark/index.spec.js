require("dotenv").config()
const request = require("supertest")
const app = require("../../app")
const mongoose = require("mongoose")
const Data = require("../../schemas/data")
const sampleData = require("../../test/data/sample.json")
const jwt = require("jsonwebtoken")
const dataId = 1
const errDataId = 2

const data = { bookmarkState: true, dataId: 1 }
describe("북마크 통합 테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_bookmark?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
    })

    describe("북마크 통합 테스트", () => {
        let Authorization, reAuthorization, aToken, rToken, userId
        beforeAll(async () => {
            const email = "bookmark@email.com"
            const nickname = "bookmark"
            const password = "detail"
            await Data.create(sampleData)
            await request(app).post(`/api/users`).send({ email, nickname, password })
            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            aToken = res.body.accessToken
            rToken = res.body.accessToken
            Authorization = `Bearer ${aToken}`
            reAuthorization = `Bearer ${rToken}`
            userId = jwt.decode(aToken).userId
        })

        it("PUT /api/marks/ dataId 에러 상황?", async () => {
            const res = await request(app).put("/api/marks").set({ Authorization, reAuthorization }).send({ errDataId })
            expect(res.statusCode).toBe(400)
            expect(res.body).toEqual({ result: "FAIL", message: "userId , dataId를 확인 해주세요" })
        })
        it("PUT /api/marks/:userId 가 잘 되나?", async () => {
            const res = await request(app).put("/api/marks").set({ Authorization, reAuthorization }).send({ dataId })
            expect(res.statusCode).toBe(201)
            expect(res.body).toEqual({ result: "SUCCESS", message: "북마크 추가 삭제 성공", data })
        })
        it("GET /api/marks/:userId 가 잘 되니?", async () => {
            const res = await request(app)
                .get("/api/marks/" + userId)
                .set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(200)
            expect(res.body.userMark).toBeDefined()
        })
        it("GET /api/marks/:userId 에러 상황", async () => {
            const res = await request(app).get("/api/marks/9999999").set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(400)
            expect(res.body).toEqual({ result: "FAIL", message: "누구니???" })
        })

        it("DELETE /api/marks/:userId 가 잘 되나?", async () => {
            const res = await request(app)
                .delete("/api/marks/" + userId)
                .send({ dataId })
                .set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(201)
        })
        it("DELETE /api/marks/:userId 에러 상황", async () => {
            const res = await request(app).delete("/api/marks/9999999").send().set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(400)
            expect(res.body).toEqual({ result: "FAIL", message: "삭제할 데이터가 없습니다." })
        })
    })
})
