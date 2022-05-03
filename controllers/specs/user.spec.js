const httpMocks = require("node-mocks-http")
const userController = require("../user.controller")
jest.mock("../../services/user.service")
const userService = require("../../services/user.service")

let req, res
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    userService.checkById = jest.fn()
    userService.updateUserInfo = jest.fn()
    userService.deleteUserInfo = jest.fn()
})

describe("유저 컨트롤러 테스트", () => {
    describe("getUsers 테스트", () => {
        it("tokenUserId !== userId인 경우 '회원정보 조회 중 오류가 발생했습니다.'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 2
            await userController.getUsers(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData().message).toStrictEqual("회원정보 조회 중 오류가 발생했습니다.")
        })
        it("회원정보 조회가 되지 않으면 '회원정보 조회 중 오류가 발생했습니다.'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 1
            userService.checkById.mockReturnValue(undefined)
            await userController.getUsers(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData().message).toStrictEqual("회원정보 조회 중 오류가 발생했습니다.")
        })
        it("회원정보 조회가 되면 '회원정보 조회 완료'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 1
            userService.checkById.mockReturnValue({ sadf: "asdf" })
            await userController.getUsers(req, res)
            expect(res.statusCode).toBe(201)
            expect(res._getJSONData().message).toStrictEqual("회원정보 조회 완료")
            expect(res._getJSONData().data).toStrictEqual({ sadf: "asdf" })
        })
    })
    describe("putUsers 테스트", () => {
        it("tokenUserId !== userId인 경우 '회원정보 수정 중 오류가 발생했습니다.'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 2
            await userController.putUsers(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData().message).toStrictEqual("회원정보 수정 중 오류가 발생했습니다.")
        })
        it("회원정보 수정이 되지 않으면 '회원정보 수정 중 오류가 발생했습니다.'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 1
            userService.updateUserInfo.mockReturnValue(undefined)
            await userController.putUsers(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData().message).toStrictEqual("회원정보 수정 중 오류가 발생했습니다.")
        })
        it("회원정보 수정이 되면 '회원정보 수정 완료'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 1
            userService.updateUserInfo.mockReturnValue({ sadf: "asdf" })
            await userController.putUsers(req, res)
            expect(res.statusCode).toBe(201)
            expect(res._getJSONData().message).toStrictEqual("회원정보 수정 완료")
        })
    })
    describe("deleteUsers 테스트", () => {
        it("tokenUserId !== userId인 경우 '회원정보 삭제 중 오류가 발생했습니다.'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 2
            await userController.deleteUsers(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData().message).toStrictEqual("회원정보 삭제 중 오류가 발생했습니다.")
        })
        it("회원정보 삭제가 되지 않으면 '회원정보 삭제 중 오류가 발생했습니다.'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 1
            userService.deleteUserInfo.mockReturnValue(undefined)
            await userController.deleteUsers(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData().message).toStrictEqual("회원정보 삭제 중 오류가 발생했습니다.")
        })
        it("회원정보 삭제가 되면 '회원정보 삭제 완료'라는 메세지를 보내는가", async () => {
            req.params.userId = 1
            res.locals.userId = 1
            userService.deleteUserInfo.mockReturnValue({ sadf: "asdf" })
            await userController.deleteUsers(req, res)
            expect(res.statusCode).toBe(201)
            expect(res._getJSONData().message).toStrictEqual("회원정보 삭제 완료")
        })
    })
})
