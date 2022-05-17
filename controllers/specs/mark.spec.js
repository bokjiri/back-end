const markController = require("../mark.controller")
const httpMocks = require("node-mocks-http")
const markData = require("../../test/data/new-mark.json")
jest.mock("../../schemas/user")
jest.mock("../../schemas/data")
jest.mock("../../schemas/redis")
const User = require("../../schemas/user")
const BokjiApi = require("../../schemas/data")
const redis = require("../../schemas/redis")
const userId = { userId: 1 }
const localsUserId = userId
const paramsUserId = userId
const falseParamsUserId = { userId: 2 }
const mark = [3, 5, 8, 9]
const dataId = 1
const updateMarks = [4, 8, 9, 5]

let req, res, next, err
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe("북마크 테스트 코드", () => {
    describe("getMarks 테스트", () => {
        it("User find가 잘 실행이되나?", async () => {
            req.params = paramsUserId
            res.locals = localsUserId
            const option = { _id: false, mark: true }
            await markController.getMarks(req, res, next)
            expect(User.findOne).toBeCalledWith(localsUserId, option)
        })
        it("BokjiAPI find가 잘 실행이되나?", async () => {
            req.params = paramsUserId
            res.locals = localsUserId
            User.findOne.mockReturnValue(mark)
            findData = { dataId: mark.mark }
            option = { _id: false, dataId: true, name: true, desire: true }
            await markController.getMarks(req, res, next)
            expect(BokjiApi.find).toBeCalledWith(findData, option)
        })
        it("getMarks localsUserId와 paramsUserId가 다를경우 에러를 잘 리턴하는가?", async () => {
            req.params = falseParamsUserId
            res.locals = localsUserId
            err = new Error("누구니???")
            const errMessage = { message: "누구니???", stack: err }
            await markController.getMarks(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("showMark가 200과 응답값을 잘 리턴하는가?", async () => {
            req.params = paramsUserId
            res.locals = localsUserId
            User.findOne.mockReturnValue(mark)
            BokjiApi.find.mockReturnValue(markData)
            redis.set.mockReturnValue(localsUserId, markData)
            await markController.getMarks(req, res, next)
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData()).toStrictEqual({ result: "SUCCESS", message: "북마크 조회 성공", userMark: markData })
        })
    })

    describe("postMarks 관련 테스트", () => {
        it("Data findOne이 잘 되는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            const option = { _id: false, dataId: true }
            await markController.postMarks(req, res, next)
            expect(BokjiApi.findOne).toBeCalledWith({ dataId }, option)
        })
        it("User findOne이 잘 되는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            dataList = [1, 2, 3, 4, 5]
            BokjiApi.findOne.mockReturnValue(dataList)
            const option = { _id: false, mark: true }
            await markController.postMarks(req, res, next)
            expect(User.findOne).toBeCalledWith({ userId }, option)
        })
        it("User update가 잘 실행되는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            dataList = [1, 2, 3, 4, 5]
            markList = { mark: [6, 7, 8] }
            BokjiApi.findOne.mockReturnValue(dataList)
            User.findOne.mockReturnValue(markList)
            const push = { $push: { mark: [dataId] } }
            await markController.postMarks(req, res, next)
            expect(User.updateOne).toHaveBeenCalledWith({ userId }, push)
        })
        it("postMarks가 200과 응답값을 잘 리턴하는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            dataList = [1, 2, 3, 4, 5]
            markList = { mark: [6, 7, 8] }
            BokjiApi.findOne.mockReturnValue(dataList)
            User.findOne.mockReturnValue(markList)
            User.updateOne.mockReturnValue(updateMarks)
            redis.set.mockReturnValue(userId, markData)
            await markController.postMarks(req, res, next)
            expect(res.statusCode).toBe(201)
            expect(res._getJSONData()).toStrictEqual({ result: "SUCCESS", message: "북마크 추가 성공" })
        })
        it("Data findOne이  에러를 잘 리턴하는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            err = new Error("데이터ID를 확인 하시오.(DB dataID 확인!)")
            const errMessage = { message: "데이터ID를 확인 하시오.(DB dataID 확인!)", stack: err }
            BokjiApi.findOne.mockReturnValue(undefined)
            await markController.postMarks(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
        it("User.findOne이  에러를 잘 리턴하는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            err = new Error("데이터ID를 확인 하시오.(DB dataID 확인!)")
            const errMessage = { message: "데이터ID를 확인 하시오.(DB dataID 확인!)", stack: err }
            dataList = [11, 22, 33, 44, 55]
            BokjiApi.findOne.mockReturnValue(dataList)
            User.findOne.mockReturnValue(null)
            await markController.postMarks(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
    })

    describe("deleteMarks 관련 테스트", () => {
        it("User findOne이 잘 되는가?", async () => {
            req.body.dataId = dataId
            res.locals.userId = userId
            await markController.deleteMarks(req, res, next)
            const option = { _id: false, mark: true }
            expect(User.findOne).toHaveBeenCalledWith({ userId }, option)
        })
        it("User update가 잘 되는가?", async () => {
            req.params.dataId = dataId
            res.locals.userId = userId
            const checkId = { mark: [1, 9500] }
            User.findOne.mockReturnValue(checkId)
            const deleteMark = { $pullAll: { mark: [dataId] } }
            await markController.deleteMarks(req, res, next)
            expect(User.updateOne).toHaveBeenCalledWith({ userId }, deleteMark)
        })
        it("User update가 200과 응답값을 잘 리턴하는가?", async () => {
            req.params.dataId = dataId
            res.locals.userId = userId
            const checkId = { mark: [1, 9500] }
            User.findOne.mockReturnValue(checkId)
            User.updateOne.mockReturnValue(dataId)
            const deleteMarkResult = { result: "SUCCESS", message: "북마크 삭제 성공" }
            redis.set.mockReturnValue(userId, dataId)
            await markController.deleteMarks(req, res, next)
            expect(res.statusCode).toBe(201)
            expect(res._getJSONData()).toStrictEqual(deleteMarkResult)
        })
        it("삭제할 유저의 북마크가 없으면 에러를 잘 리턴하는가?", async () => {
            req.params.dataId = dataId
            res.locals.userId = userId
            err = new Error("삭제할 데이터가 없습니다.")
            const errMessage = { message: "삭제할 데이터가 없습니다.", stack: err }
            const checkId = { mark: [9500] }
            User.findOne.mockReturnValue(checkId)
            await markController.deleteMarks(req, res, next)
            expect(next).toBeCalledWith(errMessage)
        })
    })
})
