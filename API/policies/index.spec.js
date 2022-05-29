const request = require("supertest")
const app = require("../../app")
const mongoose = require("mongoose")
const User = require("../../schemas/user")
const Data = require("../../schemas/data")
const redis = require("../../schemas/redis")
const sampleData = require("../../test/data/sample.json")
const jwt = require("jsonwebtoken")
const mainSampleData = require("../../test/data/new-main.json")
const patchUserData = require("../../test/user/patch.json")

describe("detail 통합테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_detail?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
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
        it("get /api/policies/:dataId 잘됨?", async () => {
            const { dataId } = await Data.findOne()
            const res = await request(app).get(`/api/policies/${dataId}`).set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(200)
        })
        it("get /api/policies/:dataId 토큰없이 잘됨?", async () => {
            const { dataId } = await Data.findOne()
            const res = await request(app).get(`/api/policies/${dataId}`)
            expect(res.statusCode).toBe(200)
        })
    })
})

describe("main 통합테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test_main?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
        await redis.quit()
    })
    describe("main 통합테스트", () => {
        let Authorization, reAuthorization, userId
        beforeAll(async () => {
            const email = "main@email.com"
            const nickname = "main"
            const password = "main"
            await Data.create(mainSampleData)
            await request(app).post(`/api/users`).send({ email, nickname, password })
            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            aToken = res.body.accessToken
            Authorization = `Bearer ${aToken}`
            reAuthorization = `Bearer ${res.body.accessToken}`
            userId = jwt.decode(aToken).userId
            await request(app).patch(`/api/users/${userId}`).set({ Authorization, reAuthorization }).send(patchUserData)
        })
        afterAll(async () => {
            await User.deleteMany()
            await Data.deleteMany()
        })
        it("get /api/policies 잘됨?", async () => {
            const res = await request(app).get(`/api/policies`).set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(200)
        })
    })
})
