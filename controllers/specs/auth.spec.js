const httpMocks = require("node-mocks-http")

describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
    // test("테스트 성공하는 상황", async () => {
    //     expect(await getKakao()).toEqual(false)
    // })
    // test("테스트 성공하는 상황", async () => {
    //     expect(await getKakao()).toEqual(true)
    // })
    // })

    // const { getKakao } = require("../auth.controller")
    // let req = httpMocks.createRequest()
    // let res = httpMocks.createResponse()

    // describe("type test", () => {
    //     test("is function?", async () => {
    //         expect(typeof getKakao).toBe("function")
    //     })
    // })
    // describe("getKakao should return", () => {
    //     it("the statusCode 200", async () => {
    //         const GK = await getKakao(req, res)
    //         expect(GK.statusCode).toEqual(200)
    //     })

    // it("user array", function () {
    //     getKakao(req, res)
    // })
})
