const request = require("supertest")
const app = require("../../app")
const markData = require("../../test/data/new-mark2.json")
const userId = 1

it("PUT /api/marks/:userId", async () => {
    const res = await request(app)
        .put("/api/marks/" + userId)
        .send(markData)
    expect(res.statusCode).toBe(200)
})
// it("PUT /api/marks/:userId로 보냈을때 에러코드를 500을 주냐?", async () => {
//     const res = await request(app)
//         .put("/api/marks/" + userId)
//         .send({ userId: })
//     expect(res.statusCode).toBe(500) //name 만 보내면 500에러를 내뱉는다.
//     expect(response.body).toStrictEqual({ message: "Product validation failed: description: Path `description` is required." }) //에러 메세지를 확인 하고 해당 메세지를 붙여서 맞는지 확인한다.
// })

it("GET /api/marks/:userId 가 잘 되니?", async () => {
    const res = await request(app).get("/api/marks/" + userId)
    expect(res.statusCode).toBe(200)
    expect(res.body.desire).toEqual(markData.desire)
    expect(res.body.name).toEqual(markData.name)
    expect(res.body.dataId).toEqual(markData.dataId)
})
