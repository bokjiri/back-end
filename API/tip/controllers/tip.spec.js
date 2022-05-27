const httpMocks = require("node-mocks-http")
const tipController = require("./tip.controller")

jest.mock("../../../schemas/user")
jest.mock("../../../schemas/data")
jest.mock("../../users/services/user.service")
const User = require("../../../schemas/user")
const BokjiAPI = require("../../../schemas/data")
const userService = require("../../users/services/user.service")

const dataId = 1
const userId = 1
const dataIdList = 1
let markList = [{ mark: [1, 2, 3] }]
let dismatchData = { dismatchData: [2, 3, 4] }
let failDismatchData = { failDismatchData: [1, 2, 3, 4] }

let req, res, next, err
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe("버그제보 테스트 코드", () => {
    describe("postTips 테스트", () => {
        it("dataId가 없으면 에러를 뱉는가?", async () => {
            req.body.dataId = undefined
            res.locals.userId = userId
            err = new Error("userId , dataId를 확인 해주세요")
            const errMessage = { message: "userId , dataId를 확인 해주세요", stack: err }
            await tipController.postTips(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("userId가 없으면 에러를 뱉는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = undefined
            err = new Error("userId , dataId를 확인 해주세요")
            const errMessage = { message: "userId , dataId를 확인 해주세요", stack: err }
            await tipController.postTips(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("BokjiAPI.findOne이 잘 실행되는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            const option = { _id: false, dataId: true }
            await tipController.postTips(req, res, next)
            expect(BokjiAPI.findOne).toBeCalledWith({ dataId }, option)
        })
        it("BokjiAPI.findOne이 없으면 에러를 뱉는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            err = new Error("DB에 dataID가 없거나 이미 버그제보한 데이터입니다.")
            const errMessage = { message: "DB에 dataID가 없거나 이미 버그제보한 데이터입니다.", stack: err }
            BokjiAPI.findOne.mockReturnValue(null)
            await tipController.postTips(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("User.find가 잘 실행되는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            const option = { _id: false, mark: true }
            BokjiAPI.findOne.mockReturnValue(dataIdList)
            await tipController.postTips(req, res, next)
            expect(User.find).toBeCalledWith({ userId }, option)
        })
        it("Mark에 dataId가 있으면 User.updateOne을 잘 실행되는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            const option = { $pullAll: { mark: [dataId] } }
            BokjiAPI.findOne.mockReturnValue(dataIdList)
            User.find.mockReturnValue(markList)
            await tipController.postTips(req, res, next)
            expect(User.updateOne).toBeCalledWith({ userId }, option)
        })
        it("User.updateOne이 잘 실행되는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            BokjiAPI.findOne.mockReturnValue(dataIdList) //데이터가 있다!
            User.find.mockReturnValue(markList) //현재 유저 북마크 5,6,7
            User.updateOne.mockReturnValue(dataId)
            User.findOne.mockReturnValue(dismatchData)
            const option = { $push: { dismatchData: [dataId] } }
            await tipController.postTips(req, res, next)
            expect(User.updateOne).toHaveBeenCalledWith({ userId }, option)
        })
        it("dismatchData에 이미 dataId가 있으면 에러를 뱉는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            err = new Error("DB에 dataID가 없거나 이미 버그제보한 데이터입니다.")
            const errMessage = { message: "DB에 dataID가 없거나 이미 버그제보한 데이터입니다.", stack: err }
            BokjiAPI.findOne.mockReturnValue(dataIdList)
            User.find.mockReturnValue(markList)
            User.findOne.mockReturnValue(failDismatchData)
            await tipController.postTips(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("postTips이 성공 했을때 응답값을 잘 보내는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            BokjiAPI.findOne.mockReturnValue(dataIdList) //데이터가 있다!
            User.find.mockReturnValue(markList) //현재 유저 북마크 1,2,3
            User.updateOne.mockReturnValue(dataId)
            User.findOne.mockReturnValue(dismatchData)
            User.updateOne.mockReturnValue(dataId)
            userService.redisSetMain(true)
            const result = { result: "SUCCESS", message: "정책 숨기기 성공" }
            await tipController.postTips(req, res, next)
            expect(res.statusCode).toEqual(200)
            expect(res._getJSONData()).toStrictEqual(result)
        })
    })
})
