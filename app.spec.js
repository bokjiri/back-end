const request = require("supertest")
const app = require("./app")
const mongoose = require("mongoose")
const User = require("./schemas/user")
const Data = require("./schemas/data")
const redis = require("./schemas/redis")
const jwt = require("jsonwebtoken")
const patchUserData = require("./test/user/patch.json")
const sampleData = require("./test/data/sample.json")
let aToken, rToken, userId, Authorization, reAuthorization
beforeAll(async () => {
    await mongoose
        .connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
        .then(async () => {
            console.log("testdb 연결완료")
            await Data.create(sampleData)
            const email = "user@email.com"
            const nickname = "user"
            const password = "user"
            await request(app).post(`/api/users`).send({ email, nickname, password })

            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            aToken = res.body.accessToken
            rToken = res.body.refreshToken
            Authorization = `Bearer ${aToken}`
            reAuthorization = `Bearer ${rToken}`
            userId = jwt.decode(aToken).userId
        })
        .catch((err) => {
            console.error(err)
        })
})
afterAll(async () => {
    await Data.deleteMany()
    await User.deleteMany()
    await mongoose.disconnect()
    await redis.quit()
})
describe("e2e 테스트", () => {
    describe("detail 통합테스트", () => {
        it("get /api/detail/:dataId 잘됨?", async () => {
            const { dataId } = await Data.findOne()
            console.log(dataId)
            console.log({ Authorization })
            console.log({ reAuthorization })
            const res = await request(app).get(`/api/detail/${dataId}`).set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(200)
        })
    })
    describe("유저 통합테스트", () => {
        it("get /api/users/:userId 유저정보 잘 불러와짐?", async () => {
            const res = await request(app).get(`/api/users/${userId}`).set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(201)
        })
        it("patch /api/users/:userId 유저정보 잘 수정됨?", async () => {
            const res = await request(app).patch(`/api/users/${userId}`).set({ Authorization, reAuthorization }).send(patchUserData)
            expect(res.statusCode).toBe(201)
        })
        it("delete /api/users/:userId 유저정보 잘 지워짐", async () => {
            const res = await request(app).delete(`/api/users/${userId}`).set({ Authorization, reAuthorization })
            expect(res.statusCode).toBe(204)
        })
    })
})
