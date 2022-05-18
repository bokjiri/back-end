const httpMocks = require("node-mocks-http")
const tipController = require("../tip.controller")

jest.mock("../../schemas/user")
jest.mock("../../schemas/data")
const User = require("../../schemas/user")
const BokjiApi = require("../../schemas/data")
const fs = require("fs")

let req, res, next, err, dataId, userId, dismatchData
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn()
    dataId = 1
    userId = 1
    dismatchData = { dismatchData: [1, 2, 3, 4] }
})

describe("버그제보 테스트 코드", () => {
    describe("postTips 테스트", () => {
        it("dataId가 없으면 에러를 뱉는가?", async () => {
            dataId = undefined
            req.body.dataId = dataId
            res.locals.userId = userId
            err = new Error("userId , dataId를 확인 해주세요")
            const errMessage = { message: "userId , dataId를 확인 해주세요", stack: err }
            await tipController.postTips(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("userId가 없으면 에러를 뱉는가?", async () => {
            userId = undefined
            req.body.dataId = dataId
            res.locals.userId = userId
            err = new Error("userId , dataId를 확인 해주세요")
            const errMessage = { message: "userId , dataId를 확인 해주세요", stack: err }
            await tipController.postTips(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("BokjiAPI.findOne이 없으면 에러를 뱉는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            err = new Error("DB에 dataID가 없거나 이미 버그제보한 데이터입니다.")
            const errMessage = { message: "DB에 dataID가 없거나 이미 버그제보한 데이터입니다.", stack: err }
            BokjiApi.findOne.mockReturnValue(null)
            await tipController.postTips(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("dismatchData에 이미 dataId가 있으면 에러를 뱉는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            err = new Error("DB에 dataID가 없거나 이미 버그제보한 데이터입니다.")
            const errMessage = { message: "DB에 dataID가 없거나 이미 버그제보한 데이터입니다.", stack: err }
            BokjiApi.findOne.mockReturnValue(dataId)
            User.findOne.mockReturnValue(dismatchData)
            await tipController.postTips(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("User.updateOne이 잘 실행되는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            dismatchData = { dismatchData: [2, 3, 4] }
            BokjiApi.findOne.mockReturnValue(dataId)
            User.findOne.mockReturnValue(dismatchData)
            const option = { $push: { dismatchData: [dataId] } }
            await tipController.postTips(req, res, next)
            expect(User.updateOne).toHaveBeenCalledWith({ userId }, option)
        })
        it("postTips이 성공 했을때 응답값을 잘 보내는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            dismatchData = { dismatchData: [2, 3, 4] }
            BokjiApi.findOne.mockReturnValue(dataId)
            User.findOne.mockReturnValue(dismatchData)
            User.updateOne.mockReturnValue(dataId)
            const result = { result: "SUCCESS", message: "정책 숨기기 성공" }
            await tipController.postTips(req, res, next)
            expect(res.statusCode).toEqual(200)
            expect(res._getJSONData()).toStrictEqual(result)
        })
        it("postTips이 성공 했을때 writeFile이 잘 실행되는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            dismatchData = { dismatchData: [2, 3, 4] }
            BokjiApi.findOne.mockReturnValue(dataId)
            User.findOne.mockReturnValue(dismatchData)
            User.updateOne.mockReturnValue(dataId)
            fs.writeFile = jest.fn()
            await tipController.postTips(req, res, next)
            expect(fs.writeFile).toHaveBeenCalledTimes(1)
            fs.writeFile.mockClear()
        })
    })
})
