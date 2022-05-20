const request = require("supertest")
const app = require("../app")
const agent = request.agent(app)
const mongoose = require("mongoose")
const redis = require("../schemas/redis")

describe("유저 통합테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_mail?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await mongoose.disconnect()
        await redis.quit()
    })
    describe("post /api/mail", () => {
        it("메일 잘 보내는가", async () => {
            const res = await request(app).post("/api/mail").send({ email: "boksei_@naver.com" })
            expect(res.statusCode).toBe(200)
        }, 15000)
        it("메일 형식이 아님", async () => {
            const res = await request(app).post("/api/mail").send({ email: "asdfasdf" })
            expect(res.statusCode).toBe(400)
        }, 15000)
    })
    describe("post /api/mail/cert", () => {
        let cookie, authCode
        beforeEach(async () => {
            const response = await request(app).post("/api/mail").send({ email: "boksei_@naver.com" })
            authCode = response.body.authCode
            cookie = response.headers["set-cookie"]
        })
        it("본인인증 잘함?", async () => {
            const res = await request(app).post("/api/mail/cert").set("Cookie", cookie).send({ authCode })
            expect(res.statusCode).toBe(201)
        }, 15000)
        it("본인인증 쿠키없이 됨?", async () => {
            const res = await request(app).post("/api/mail/cert").send({ authCode })
            expect(res.statusCode).toBe(400)
        }, 15000)
        it("본인인증 authCode 없이 됨?", async () => {
            const res = await request(app).post("/api/mail/cert").set("Cookie", cookie)
            expect(res.statusCode).toBe(400)
        }, 15000)
        it("본인인증 엉터리 authCode 됨?", async () => {
            const res = await request(app).post("/api/mail/cert").set("Cookie", cookie).send({ authCode: "asdf" })
            expect(res.statusCode).toBe(400)
        }, 15000)
    })
})
