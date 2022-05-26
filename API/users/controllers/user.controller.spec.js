const httpMocks = require("node-mocks-http")
const userController = require("./user.controller")
jest.mock("../services/user.service")
jest.mock("../../policies/services/main.service")
const userService = require("../services/user.service")
const mainService = require("../../policies/services/main.service")
const paramsUserId = "1"
class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}
let req, res, next, error
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
    userService.checkById = jest.fn()
    userService.updateUserInfo = jest.fn()
    userService.deleteUserInfo = jest.fn()
    userService.redisSetUser = jest.fn()
    userService.redisSetMain = jest.fn()
})

describe("유저 컨트롤러 테스트", () => {
    describe("getUsers 테스트", () => {
        it("tokenUserId !== userId인 경우 '토큰하고 유저아이디가 다름 비정상적인 접근'라는 메세지를 보내는가", async () => {
            req.params.userId = paramsUserId
            res.locals.userId = 2
            error = new ValidationError("토큰하고 유저아이디가 다름 비정상적인 접근")

            const errorMessage = {
                message: error.message,
                stack: error.stack,
            }

            await userController.getUsers(req, res, next)
            expect(next).toBeCalledWith(expect.objectContaining({ message: errorMessage.message }))
        })
        it("회원정보 조회가 되지 않으면 '회원정보가 없음'라는 메세지를 보내는가", async () => {
            req.params.userId = paramsUserId
            res.locals.userId = 1
            error = new ValidationError("회원정보가 없음")
            const errorMessage = {
                message: error.message,
                stack: error.stack,
            }
            userService.checkById.mockReturnValue(undefined)
            await userController.getUsers(req, res, next)
            expect(next).toBeCalledWith(expect.objectContaining({ message: errorMessage.message }))
        })
        // it("회원정보 조회가 되면 '회원정보 조회 완료'라는 메세지를 보내는가", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1
        //     userService.checkById.mockReturnValue({
        //         region: ["경기도", "고양시"],
        //         disability: ["없음"],
        //         age: 19991020,
        //     })
        //     userService.redisSetUser.mockReturnValue(true)
        //     await userController.getUsers(req, res, next)
        //     expect(res.statusCode).toBe(200)
        //     expect(res._getJSONData().message).toStrictEqual("회원정보 조회 완료")
        //     expect(res._getJSONData().data).toStrictEqual({
        //         region: ["경기도", "고양시"],
        //         disability: ["없음"],
        //         age: 19991020,
        //     })
        // })
        // it("시·군을 선택하지 않았다면 시·군을 선택해 주세요로 바뀌어서 보내주는 가?", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1

        //     userService.checkById.mockReturnValue({
        //         region: ["경기도"],
        //         disability: ["없음"],
        //         age: 20201020,
        //     })
        //     await userController.getUsers(req, res, next)
        //     expect(res.statusCode).toBe(201)
        //     expect(res._getJSONData().message).toStrictEqual("회원정보 조회 완료")
        //     expect(res._getJSONData().data).toStrictEqual({
        //         region: ["경기도", "시·군을 선택해 주세요"],
        //         disability: ["없음"],
        //         age: 20201020,
        //     })
        // })
        // it("시·도 과 시·군을 선택하지 않았다면 시·도를 선택해 주세요와 시·군을 선택해 주세요로 바뀌어서 보내주는 가?", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1

        //     userService.checkById.mockReturnValue({
        //         region: [],
        //         disability: ["없음"],
        //         age: 20201020,
        //     })
        //     await userController.getUsers(req, res, next)
        //     expect(res.statusCode).toBe(201)
        //     expect(res._getJSONData().message).toStrictEqual("회원정보 조회 완료")
        //     expect(res._getJSONData().data).toStrictEqual({
        //         region: ["시·도를 선택해 주세요", "시·군을 선택해 주세요"],
        //         disability: ["없음"],
        //         age: 20201020,
        //     })
        // })
    })
    describe("patchUsers 테스트", () => {
        it("tokenUserId !== userId인 경우 '토큰하고 유저아이디가 다름 비정상적인 접근'라는 메세지를 보내는가", async () => {
            req.params.userId = paramsUserId
            res.locals.userId = 2

            error = new ValidationError("토큰하고 유저아이디가 다름 비정상적인 접근")
            const errorMessage = {
                message: error.message,
                stack: error.stack,
            }

            await userController.patchUsers(req, res, next)
            expect(next).toBeCalledWith(expect.objectContaining({ message: errorMessage.message }))
        })
        // it("회원정보 수정이 되지 않으면 'db에서 update 실패'라는 메세지를 보내는가", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1

        //     error = new ValidationError("db에서 update 실패")
        //     const errorMessage = {
        //         message: error.message,
        //         stack: error.stack,
        //     }

        //     const age = 20201010
        //     const gender = []
        //     const region = "경기도 고양시"
        //     const disability = ["없음"]
        //     let job
        //     req.body = { age, gender, region, disability, job }

        //     userService.updateUserInfo.mockReturnValue(undefined)
        //     await userController.patchUsers(req, res, next)
        //     expect(next).toBeCalledWith(expect.objectContaining({ message: errorMessage.message }))
        // })
        // it("job이 미취업일 때 미취업자로 잘 바뀌는가", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1
        //     const age = 20201010
        //     const gender = []
        //     const region = "경기도 고양시"
        //     const disability = ["없음"]
        //     let obstacle, marriage, target, salary, scholarship, family, workType
        //     let job = "미취업"
        //     req.body = {
        //         age,
        //         gender,
        //         region,
        //         disability,
        //         marriage,
        //         target,
        //         salary,
        //         scholarship,
        //         family,
        //         job,
        //         obstacle,
        //         workType,
        //     }

        //     await userController.patchUsers(req, res, next)
        //     expect(userService.updateUserInfo).toHaveBeenCalledWith(
        //         1,
        //         20201010,
        //         [],
        //         ["경기도", "고양시"],
        //         ["없음"],
        //         undefined,
        //         "미취업자",
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined,
        //         undefined
        //     )
        // })
        // it("시·군을 선택해주세요로 들어왔을 때 빈값으로 바뀌는가", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1
        //     const age = 20201010
        //     const gender = []
        //     const region = "경기도 시·군을 선택해 주세요"
        //     const disability = ["없음"]
        //     let obstacle, marriage, target, salary, scholarship, family, workType
        //     let job = "미취업"
        //     req.body = {
        //         age,
        //         gender,
        //         region,
        //         disability,
        //         marriage,
        //         target,
        //         salary,
        //         scholarship,
        //         family,
        //         job,
        //         obstacle,
        //         workType,
        //     }

        //     await userController.patchUsers(req, res, next)
        //     expect(userService.updateUserInfo).toHaveBeenCalledWith(1, 20201010, [], "경기도", ["없음"], undefined, "미취업자", undefined, undefined, undefined, undefined, undefined, undefined)
        // })
        // it("------- 시·군을 선택해주세요로 들어왔을 때 빈값으로 바뀌는가", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1
        //     const age = 20201010
        //     const gender = []
        //     const region = "------- 시·군을 선택해 주세요"
        //     const disability = ["없음"]
        //     let obstacle, marriage, target, salary, scholarship, family, workType
        //     let job = "미취업"
        //     req.body = {
        //         age,
        //         gender,
        //         region,
        //         disability,
        //         marriage,
        //         target,
        //         salary,
        //         scholarship,
        //         family,
        //         job,
        //         obstacle,
        //         workType,
        //     }

        //     await userController.patchUsers(req, res, next)
        //     expect(userService.updateUserInfo).toHaveBeenCalledWith(1, 20201010, [], [], ["없음"], undefined, "미취업자", undefined, undefined, undefined, undefined, undefined, undefined)
        // })
        // it("시·도를 선택해 주세요 시·군을 선택해주세요로 들어왔을 때 빈값으로 바뀌는가", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1
        //     const age = 20201010
        //     const gender = []
        //     const region = "시·도를 선택해 주세요 시·군을 선택해 주세요"
        //     const disability = ["없음"]
        //     let obstacle, marriage, target, salary, scholarship, family, workType
        //     let job = "미취업"
        //     req.body = {
        //         age,
        //         gender,
        //         region,
        //         disability,
        //         marriage,
        //         target,
        //         salary,
        //         scholarship,
        //         family,
        //         job,
        //         obstacle,
        //         workType,
        //     }

        //     await userController.patchUsers(req, res, next)
        //     expect(userService.updateUserInfo).toHaveBeenCalledWith(1, 20201010, [], [], ["없음"], undefined, "미취업자", undefined, undefined, undefined, undefined, undefined, undefined)
        // })
        // it("회원정보 수정이 되면 '회원정보 수정 완료'라는 메세지를 보내는가", async () => {
        //     req.params.userId = paramsUserId
        //     res.locals.userId = 1
        //     const age = 20201010
        //     const gender = []
        //     const region = "경기도 고양시"
        //     const disability = ["없음"]
        //     let job
        //     req.body = { age, gender, region, disability, job }
        //     userService.updateUserInfo.mockReturnValue(true)
        //     userService.redisSetUser.mockReturnValue(true)
        //     mainService.redisSet.mockReturnValue(true)
        //     mainController.categorize.mockReturnValue(true)
        //     await userController.patchUsers(req, res, next)
        //     expect(res.statusCode).toBe(201)
        //     expect(res._getJSONData().message).toStrictEqual("회원정보 수정 완료")
        // })
    })
    describe("deleteUsers 테스트", () => {
        it("tokenUserId !== userId인 경우 '토큰하고 유저아이디가 다름 비정상적인 접근'라는 메세지를 보내는가", async () => {
            req.params.userId = paramsUserId
            res.locals.userId = 2

            error = new ValidationError("토큰하고 유저아이디가 다름 비정상적인 접근")
            const errorMessage = {
                message: error.message,
                stack: error.stack,
            }

            await userController.deleteUsers(req, res, next)
            expect(next).toBeCalledWith(expect.objectContaining({ message: errorMessage.message }))
        })
        it("회원정보 삭제가 되지 않으면 'db에서 delete 실패'라는 메세지를 보내는가", async () => {
            req.params.userId = paramsUserId
            res.locals.userId = 1

            error = new ValidationError("db에서 delete 실패")
            const errorMessage = {
                message: error.message,
                stack: error.stack,
            }

            userService.deleteUserInfo.mockReturnValue(undefined)
            await userController.deleteUsers(req, res, next)
            expect(next).toBeCalledWith(expect.objectContaining({ message: errorMessage.message }))
        })
        it("회원정보 삭제가 되면 '회원정보 삭제 완료'라는 메세지를 보내는가", async () => {
            req.params.userId = paramsUserId
            res.locals.userId = 1
            userService.deleteUserInfo.mockReturnValue({ sadf: "asdf" })
            await userController.deleteUsers(req, res, next)
            expect(res.statusCode).toBe(204)
            expect(res._getJSONData().message).toStrictEqual("회원정보 삭제 완료")
        })
    })
})
