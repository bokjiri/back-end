const request = require("supertest")
const app = require("../../app")
const mongoose = require("mongoose")

describe("뉴스 통합 테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_news?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
    })

    describe("뉴스 통합 테스트", () => {
        let Authorization, reAuthorization, aToken, rToken
        beforeAll(async () => {
            const email = "news@email.com"
            const nickname = "news"
            const password = "news"
            await request(app).post(`/api/users`).send({ email, nickname, password })
            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            aToken = res.body.accessToken
            rToken = res.body.accessToken
            Authorization = `Bearer ${aToken}`
            reAuthorization = `Bearer ${rToken}`
        })
        it("GET /api/news/ 가 잘 되나?", async () => {
            const res = await request(app).get("/api/news").set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(200)
        })
        it("GET /api/news 토큰없으면 에러를 잘 뱉나?", async () => {
            const res = await request(app).get("/api/news")
            expect(res.statusCode).toBe(401)
        })
    })
})
