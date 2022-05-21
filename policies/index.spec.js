const request = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const User = require("../schemas/user")
const Data = require("../schemas/data")
const redis = require("../schemas/redis")
const jwt = require("jsonwebtoken")
const sampleData = require("../test/data/sample.json")
const email = "detail@email.com"
const nickname = "detail"
const password = "detail"
describe("detail 통합테스트", () => {
    let aToken, rToken, userId, Authorization, reAuthorization
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_detail?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
            await Data.create(sampleData)

            await request(app).post(`/api/users`).send({ email, nickname, password })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await User.deleteMany()
        await Data.deleteMany()
        await mongoose.disconnect()
        await redis.quit()
    })
    beforeEach(async () => {
        const res = await request(app).post(`/api/users/auth`).send({ email, password })
        aToken = res.body.accessToken
        rToken = res.body.accessToken
        Authorization = `Bearer ${aToken}`
        reAuthorization = `Bearer ${rToken}`
        userId = jwt.decode(aToken).userId
    })

    it("get /api/detail/:dataId 잘됨?", async () => {
        const { dataId } = await Data.findOne()
        const res = await request(app).get(`/api/detail/${dataId}`).set({ Authorization, reAuthorization })
        expect(res.statusCode).toBe(200)
    })
    it("get /api/detail/:dataId 토큰없이 안됨?", async () => {
        const { dataId } = await Data.findOne()
        const res = await request(app).get(`/api/detail/${dataId}`)
        expect(res.statusCode).toBe(401)
    })
})
