const request = require("supertest")
const app = require("../../app")
const mongoose = require("mongoose")
const Data = require("../../schemas/data")
const sampleData = require("../../test/data/sample.json")
const jwt = require("jsonwebtoken")
const dataId = 1
const patchUserData = require("../../test/user/patch.json")
describe("버그제보 통합 테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_tip?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
    })

    describe("버그제보 통합 테스트", () => {
        let Authorization, reAuthorization, aToken, rToken
        beforeAll(async () => {
            const email = "news@email.com"
            const nickname = "news"
            const password = "news"
            await Data.create(sampleData)
            await request(app).post(`/api/users`).send({ email, nickname, password })
            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            aToken = res.body.accessToken
            rToken = res.body.accessToken
            Authorization = `Bearer ${aToken}`
            reAuthorization = `Bearer ${rToken}`
            userId = jwt.decode(aToken).userId
            await request(app).patch(`/api/users/${userId}`).set({ Authorization, reAuthorization }).send(patchUserData)
        })
        it("POST /api/tips 가 잘 되나?", async () => {
            const res = await request(app).post("/api/tips").set({ Authorization, reAuthorization }).send({ dataId })
            expect(res.statusCode).toBe(200)
        })
        it("POST /api/tips 가 토큰이 없을 때 에러를 뱉나?", async () => {
            const res = await request(app).post("/api/tips").send({ dataId })
            expect(res.statusCode).toBe(401)
        })
        it("POST /api/tips 가 dataId가 없을 때 에러를 뱉나?", async () => {
            const nullDataId = null
            const res = await request(app).post("/api/tips").set({ Authorization, reAuthorization }).send({ nullDataId })
            expect(res.statusCode).toBe(400)
        })
    })
})
