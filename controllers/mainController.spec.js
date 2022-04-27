const httpMocks = require("node-mocks-http")

//유닛 테스트 기본틀
describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
})

const { getMain } = require("./mainController")

//Mock 함수 생성
jest.mock("./mainController")

//beforeEach
let req, res
beforeEach(() => {
    getMain.mockClear()
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
})

//api 존재 여부 확인
describe("type test", () => {
    test("is function?", async () => {
        expect(typeof getMain).toBe("function")
    })
})

//getMain API TEST
describe("getMain should return", () => {
    beforeEach(() => {
        // req.body = reqQuery
    })
    it("the statusCode 200", async () => {
        const GM = await getMain(req, res)
        expect(GM.statusCode).toEqual(200)
    })
})
