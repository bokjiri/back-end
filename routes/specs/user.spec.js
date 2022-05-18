const request = require("supertest")
const app = require("../../app")
const agent = request.agent(app)
const jwt = require("jsonwebtoken")

// describe("user 통합 테스트", () => {
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
// })
