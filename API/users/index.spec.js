const request = require("supertest")
const app = require("../../app")
const mongoose = require("mongoose")
const User = require("../../schemas/user")
const redis = require("../../schemas/redis")
const jwt = require("jsonwebtoken")
const patchUserData = require("../../test/user/patch.json")

describe("유저 통합테스트", () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.113.209:27017/test_user?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await User.deleteMany()
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
        await redis.quit()
    })
    it("post /api/users 회원가입 잘됨?", async () => {
        const email = "user@email.com"
        const nickname = "user"
        const password = "user"
        const res = await request(app).post(`/api/users`).send({ email, nickname, password })
        expect(res.statusCode).toBe(201)
    })

    describe("유저 통합테스트", () => {
        let aToken, rToken, userId, Authorization, reAuthorization
        beforeAll(async () => {
            const email = "user@email.com"
            const password = "user"
            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            aToken = res.body.accessToken
            rToken = res.body.refreshToken
            Authorization = `Bearer ${aToken}`
            reAuthorization = `Bearer ${rToken}`
            userId = jwt.decode(aToken).userId
        })
        it("get /api/users/:userId 유저정보 잘 불러와짐?", async () => {
            const res = await request(app).get(`/api/users/${userId}`).set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(201)
        })
        it("get /api/users/:userId 토큰없이 유저정보 잘 불러와짐?", async () => {
            const res = await request(app).get(`/api/users/${userId}`)
            expect(res.statusCode).toBe(401)
        })
        it("patch /api/users/:userId 유저정보 잘 수정됨?", async () => {
            const res = await request(app).patch(`/api/users/${userId}`).set({ Authorization, reAuthorization }).send(patchUserData)
            expect(res.statusCode).toBe(201)
        })
        it("patch /api/users/:userId 토큰없이 유저정보 잘 수정됨?", async () => {
            const res = await request(app).patch(`/api/users/${userId}`).send(patchUserData)
            expect(res.statusCode).toBe(401)
        })
        it("delete /api/users/:userId 토큰없이 유저정보 잘 지워짐", async () => {
            const res = await request(app).delete(`/api/users/${userId}`)
            expect(res.statusCode).toBe(401)
        })
        it("delete /api/users/:userId 유저정보 잘 지워짐", async () => {
            const res = await request(app).delete(`/api/users/${userId}`).set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(204)
        })
    })
})
