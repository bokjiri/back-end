const request = require("supertest")
const app = require("../../app")
const userId = 1
let dataId = [23, 24]

describe("북마크 통합 테스트", () => {
    it("PUT /api/marks/:userId 가 잘 되나?", async () => {
        const res = await request(app)
            .put("/api/marks/" + userId)
            .send({ dataId })
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: "SUCCESS" })
    })
    it("PUT /api/marks/:userId 에러 상황?", async () => {
        const res = await request(app).put("/api/marks/9999999").send(dataId)
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ message: "북마크 수정에 실패하였습니다." })
    })

    it("GET /api/marks/:userId 가 잘 되니?", async () => {
        const res = await request(app).get("/api/marks/" + userId)
        expect(res.statusCode).toBe(200)
        expect(res.body.userMark).toBeDefined()
        dataId.push(res.body.userMark[0].dataId)
    })
    it("GET /api/marks/:userId 에러 상황", async () => {
        const res = await request(app).get("/api/marks/9999999")
        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ message: "북마크 데이터를 받아 오지 못했습니다." })
    })

    it("DELETE /api/marks/:userId 가 잘 되나?", async () => {
        const res = await request(app)
            .delete("/api/marks/" + userId)
            .send({ dataId })
        expect(res.statusCode).toBe(200)
    })
    it("DELETE /api/marks/:userId 에러 상황", async () => {
        const res = await request(app).delete("/api/marks/9999999").send()
        expect(res.statusCode).toBe(400)
        // expect(res.body).toBe(200)
    })
})
