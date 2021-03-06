require("dotenv").config()
const markController = require("./mark.controller")
const httpMocks = require("node-mocks-http")
const markData = require("../../../test/data/new-mark.json")
jest.mock("../../../schemas/user")
jest.mock("../../../schemas/data")
jest.mock("../../../schemas/redis")
const User = require("../../../schemas/user")
const BokjiApi = require("../../../schemas/data")
const redis = require("../../../schemas/redis")
const userId = { userId: 1 }
const paramsUserId = { userId: "1" }
const localsUserId = userId
const falseParamsUserId = { userId: 2 }
const mark = [3, 5, 8, 9]
const dataId = 1

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
            expect(next).toBeCalledWith(expect.objectContaining({ message: errMessage.message }))
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
        it("dataId,userId가 없으면 에러를 잘 뱉는가?", async () => {
            res.locals.userId = undefined
            req.body.dataId = undefined
            err = new Error("userId , dataId를 확인 해주세요")
            const errMessage = { message: "userId , dataId를 확인 해주세요", stack: err }
            await markController.postMarks(req, res, next)
            expect(next).toBeCalledWith(expect.objectContaining({ message: errMessage.message }))
        })
        it("User findOne이 잘 되는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            const option = { _id: false, mark: true }
            await markController.postMarks(req, res, next)
            expect(User.findOne).toBeCalledWith({ userId }, option)
        })
        it("User findOne값에 dataId 가 포함되어 있으면 pullAll을 하는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            data = { mark: [1, 2, 3, 4] }
            User.findOne.mockReturnValue(data)
            const option = { $pullAll: { mark: [dataId] } }
            await markController.postMarks(req, res, next)
            expect(User.updateOne).toBeCalledWith({ userId }, option)
        })
        it("User findOne값에 dataId 가 포함되어 있지 않으면 push를 하는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            data = { mark: [2, 3, 4] }
            User.findOne.mockReturnValue(data)
            const option = { $push: { mark: [dataId] } }
            await markController.postMarks(req, res, next)
            expect(User.updateOne).toBeCalledWith({ userId }, option)
        })
        it("dataCheck가 잘 되는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            data = { mark: [2, 3, 4] }
            User.findOne.mockReturnValue(data)
            User.updateOne.mockReturnValue(dataId)
            const option = { _id: false, dataId: true, bookmarkState: true }
            await markController.postMarks(req, res, next)
            expect(BokjiApi.findOne).toBeCalledWith({ dataId }, option)
        })
        it("checkBookmark가 잘 되는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            data = { mark: [2, 3, 4] }
            const bookmarkState = { dataId, bookmarkState: true }
            User.findOne.mockReturnValue(data)
            User.updateOne.mockReturnValue(dataId)
            BokjiApi.findOne.mockReturnValue(bookmarkState)
            const option = { _id: false, mark: true }
            await markController.postMarks(req, res, next)
            expect(User.findOne).toBeCalledWith({ userId }, option)
        })
        it("bookmarkState가 잘 변경 되는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            markList = { mark: [1, 2, 3, 4] }
            User.findOne.mockReturnValue(markList) //pushMark에 관한 함수
            User.updateOne.mockReturnValue(dataId) //pushMark에 관한 함수
            const bookmarkState = { dataId, bookmarkState: false }
            const data = { dataId, bookmarkState: true }
            BokjiApi.findOne.mockReturnValue(bookmarkState) //status가 false
            User.findOne.mockReturnValue(markList) //markList에 dataId가 포함되므로 bookmarkState는 true로 변경 되야 함
            await markController.postMarks(req, res, next)
            expect(res._getJSONData()).toStrictEqual({ result: "SUCCESS", message: "북마크 추가 삭제 성공", data })
        })
        it("postMarks가 200과 응답값을 잘 리턴하는가?", async () => {
            res.locals.userId = userId
            req.body.dataId = dataId
            markList = { mark: [1, 2, 3, 4] }
            User.findOne.mockReturnValue(markList) //pushMark에 관한 함수
            User.updateOne.mockReturnValue(dataId) //pushMark에 관한 함수
            const bookmarkState = { dataId, bookmarkState: false }
            const data = { dataId, bookmarkState: true }
            BokjiApi.findOne.mockReturnValue(bookmarkState) //status가 false
            User.findOne.mockReturnValue(markList) //markList에 dataId가 포함되므로 bookmarkState는 true로 변경 되야 함
            redis.set.mockReturnValue(userId, markData)
            await markController.postMarks(req, res, next)
            expect(res.statusCode).toBe(201)
            expect(res._getJSONData()).toStrictEqual({ result: "SUCCESS", message: "북마크 추가 삭제 성공", data })
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
        it("삭제할 유저의 북마크가 없으면 에러를 잘 리턴하는가?", async () => {
            req.params.dataId = dataId
            res.locals.userId = userId
            err = new Error("삭제할 데이터가 없습니다.")
            const errMessage = { message: "삭제할 데이터가 없습니다.", stack: err }
            const checkId = { mark: [9500] }
            User.findOne.mockReturnValue(checkId)
            await markController.deleteMarks(req, res, next)
            expect(next).toBeCalledWith(expect.objectContaining({ message: errMessage.message }))
        })
        it("User update가 200과 응답값을 잘 리턴하는가?", async () => {
            req.params.dataId = dataId
            res.locals.userId = userId
            const checkId = { mark: [1, 2] }
            markList = { mark: [1, 2, 3, 4] }
            User.findOne.mockReturnValue(checkId)
            User.updateOne.mockReturnValue(dataId)
            const bookmarkState = { dataId, bookmarkState: false }
            const data = { dataId, bookmarkState: true }
            BokjiApi.findOne.mockReturnValue(bookmarkState)
            User.findOne.mockReturnValue(markList)
            redis.set.mockReturnValue(userId, dataId)
            await markController.deleteMarks(req, res, next)
            expect(res.statusCode).toBe(201)
            expect(res._getJSONData()).toStrictEqual({ result: "SUCCESS", message: "북마크 삭제 성공", data })
        })
    })
})
