const httpMocks = require("node-mocks-http")

describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
})

const { postTips } = require("../tip.controller")
let req = httpMocks.createRequest()
let res = httpMocks.createResponse()

describe("type test", () => {
    test("is function?", async () => {
        expect(typeof postTips).toBe("function")
    })
})
describe("postTips should return", () => {
    it("the statusCode 200", async () => {
        const PTs = await postTips(req, res)
        expect(PTs.statusCode).toEqual(200)
    })
})
