const httpMocks = require("node-mocks-http")
const mainController = require("./policy.controller")
jest.mock("../services/policy.service")
const detailService = require("../services/policy.service")
const paramsDataId = "1"
class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}
let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})
describe("detail.controller 테스트", () => {
    describe("getDetail 테스트", () => {
        it("data가 없을 때 '상세페이지 조회 실패'라는 메세지를 보내는가", async () => {
            req.params.dataId = paramsDataId
            res.locals.userid = 1
            error = new ValidationError("data가 존재하지 않습니다.")

            const errorMessage = {
                message: error.message,
                stack: error.stack,
            }
            detailService.findData.mockReturnValue(null)
            await detailController.getDetail(req, res, next)
            expect(next).toBeCalledWith(expect.objectContaining({ message: errorMessage.message }))
        })
        it("북마크가 true여야 하는 경우 false 인가", async () => {
            req.params.dataId = paramsDataId
            res.locals.userid = 1
            detailService.findData.mockReturnValue({ bookmarkState: false })
            detailService.checkBookmark.mockReturnValue({ mark: [1, 2, 3] })

            await detailController.getDetail(req, res, next)
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData().data).toStrictEqual({ bookmarkState: true })
            expect(res._getJSONData().message).toStrictEqual("상세페이지 조회 성공")
        })
        it("북마크가 false여야 하는 경우 false 인가", async () => {
            req.params.dataId = paramsDataId
            res.locals.userid = 1
            detailService.findData.mockReturnValue({ bookmarkState: false })
            detailService.checkBookmark.mockReturnValue({ mark: [2, 3, 4] })

            await detailController.getDetail(req, res, next)
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData().data).toStrictEqual({ bookmarkState: false })
            expect(res._getJSONData().message).toStrictEqual("상세페이지 조회 성공")
        })
    })
})
