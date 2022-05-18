const request = require("supertest")
const app = require("../../app")
const agent = request.agent(app)
const mongoose = require("mongoose")
const User = require("../../schemas/user")

describe("user 통합 테스트", () => {
    beforeAll(async () => {
        await mongoose
            .connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/test?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
            .then(() => {
                console.log("testdb 연결완료")
            })
            .catch((err) => {
                console.error(err)
            })
    })
    afterAll(async () => {
        await User.deleteMany()
    })
    describe("post /api/users", () => {
        it("post /api/users 회원가입 잘됨?", async () => {
            const email = "email@email.com"
            const nickname = "asdf"
            const password = "asdf"
            const res = await request(app).post(`/api/users`).send({ email, nickname, password })
            expect(res.statusCode).toBe(201)
        })
    })
    describe("post /api/users/auth", () => {
        beforeEach(async () => {
            const email = "email@email.com"
            const password = "asdf"
            const res = await request(app).post(`/api/users/auth`).send({ email, password })
            const aToken = res.body.accessToken
            const rToken = res.body.accessToken
        })

        it("post /api/users/auth 로그인 잘됨?", async () => {
            // expect(res.statusCode).toBe(200)
        })
    })
    //     describe("get /api/users/:userId", () => {
    //         it("get /api/users/:userId 잘 되나?", async () => {
    //             const userId = "73"
    //             const res = await request(app)
    //                 .get(`/api/users/${userId}`)
    //                 .set(
    //                     "Authorization",
    //                     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjczLCJuaWNrbmFtZSI6IuydtO2RuOumhCIsInByb2ZpbGVVcmwiOiJodHRwOi8vay5rYWthb2Nkbi5uZXQvZG4vZHBrOWwxL2J0cW1HaEEybEtML096MHdEdUpuMVlWMkRJbjkyZjZEVksvaW1nXzY0MHg2NDAuanBnIiwiZW1haWwiOiJwb29yZXVtODNAZ21haWwuY29tIiwiaWF0IjoxNjUyNzk3NTkwLCJleHAiOjE2NTI4ODM5OTB9.jZxkdklHbQKx9xgeaLf8wMPJXRPzCsoGrxKuZ5lQkUo"
    //                 )
    //             expect(res.statusCode).toBe(201)
    //         })
    //     })
})
