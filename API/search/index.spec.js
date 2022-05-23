const request = require("supertest")
const app = require("../../app")
const mongoose = require("mongoose")
const Data = require("../../schemas/data")
const searchData = require("../../test/data/search.json")
const jwt = require("jsonwebtoken")
const patchUserData = require("../../test/user/patch.json")

describe("검색 통합 테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_search?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
    })

    describe("검색 통합 테스트", () => {
        let Authorization, reAuthorization, aToken, rToken
        beforeAll(async () => {
            const email = "news@email.com"
            const nickname = "news"
            const password = "news"
            await Data.create(searchData)
            await request(app).post(`/api/users`).send({ email, nickname, password })
            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            aToken = res.body.accessToken
            rToken = res.body.accessToken
            Authorization = `Bearer ${aToken}`
            reAuthorization = `Bearer ${rToken}`
            userId = jwt.decode(aToken).userId
            await request(app).patch(`/api/users/${userId}`).set({ Authorization, reAuthorization }).send(patchUserData)
        }, 15000)
        it("GET /api/search 가 잘 되나?", async () => {
            const res = await request(app).post("/api/search").set({ Authorization, reAuthorization }).send({ searchKey: "일자리", type: "정책분야" })
            expect(res.statusCode).toBe(200)
        })
        it("GET /api/search 가 토큰이 없을때 에러를 뱉나?", async () => {
            const res = await request(app).post("/api/search").send({ searchKey: "일자리", type: "정책분야" })
            expect(res.statusCode).toBe(401)
        })
        it("GET /api/search 가 입력이 없을때 에러를 뱉나?", async () => {
            const res = await request(app).post("/api/search").set({ Authorization, reAuthorization }).send({ searchKey: null, type: null })
            expect(res.statusCode).toBe(400)
        })
        it("GET /api/search 가 입력값이 이상하면 message를 잘보내나?", async () => {
            const res = await request(app).post("/api/search").set({ Authorization, reAuthorization }).send({ searchKey: "가나다라", type: "정책분야" })
            expect(res.statusCode).toBe(200)
            expect(res.body).toEqual({ message: "정책 키워드를 확인해 주세요" })
        })
    })
})
