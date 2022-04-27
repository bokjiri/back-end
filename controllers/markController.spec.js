const httpMocks = require("node-mocks-http")

describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
})

const { getMarks, postMarks, deleteMarks } = require("./markController")
let req = httpMocks.createRequest()
let res = httpMocks.createResponse()

describe("type test", () => {
    test("is function?", async () => {
        expect(typeof getMarks).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof postMarks).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof deleteMarks).toBe("function")
    })
})

describe("getMarks should return", () => {
    it("the statusCode 200", async () => {
        const GMs = await getMarks(req, res)
        expect(GMs.statusCode).toEqual(200)
    })
})
describe("postMarks should return", () => {
    it("the statusCode 200", async () => {
        const PMs = await postMarks(req, res)
        expect(PMs.statusCode).toEqual(200)
    })
})
describe("deleteMarks should return", () => {
    it("the statusCode 200", async () => {
        const DMs = await deleteMarks(req, res)
        expect(DMs.statusCode).toEqual(200)
    })
})
