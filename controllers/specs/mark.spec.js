const markController = require("../mark.controller")
const httpMocks = require("node-mocks-http")
const markData = require("../../test/data/new-mark.json")
jest.mock("../../schemas/user")
jest.mock("../../schemas/data")
const User = require("../../schemas/user")
const BokjiApi = require("../../schemas/data")
const userId = { userId: 1 }
const mark = [1, 3, 5, 8, 9]
const dataId = [1, 3, 5, 8, 9]
const beforeMarks = [4, 8, 9, 5]

let req, res
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
})

describe("북마크 테스트 코드", () => {
    describe("getMarks 테스트", () => {
        it("User find 가 잘 실행이되나?", async () => {
            req.params.userId = userId
            const option = { _id: false, mark: true }
            await markController.getMarks(req, res)
            expect(User.findOne).toBeCalledWith({ userId }, option)
        })
        it("BokjiAPI find 가 잘 실행이되나?", async () => {
            req.params.userId = userId
            User.findOne.mockReturnValue(mark)
            findData = { dataId: mark.mark }
            option = { _id: false, dataId: true, name: true, desire: true }
            await markController.getMarks(req, res)
            expect(BokjiApi.find).toBeCalledWith(findData, option)
        })
        it("showMark가 400과 응답값을 잘 리턴하는가?", async () => {
            BokjiApi.find.mockReturnValue(null)
            await markController.getMarks(req, res)
            const markResult = { message: "북마크 데이터를 받아 오지 못했습니다." }
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData()).toStrictEqual(markResult)
        })
        it("showMark가 200과 응답값을 잘 리턴하는가?", async () => {
            User.findOne.mockReturnValue(mark)
            BokjiApi.find.mockReturnValue(markData)
            await markController.getMarks(req, res)
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData()).toStrictEqual({ userMark: markData })
        })
    })

    describe("postMarks 관련 테스트", () => {
        it("User findOne이 잘 되는가?", async () => {
            req.params.userId = userId
            await markController.postMarks(req, res)
            expect(User.findOne).toBeCalledWith({ userId })
        })
        it("User update가 잘 실행되는가?", async () => {
            req.body.dataId = dataId
            req.params.userId = userId
            User.findOne.mockReturnValue(beforeMarks)
            const set = { $set: { mark: dataId } }
            const unset = { $unset: { mark: beforeMarks.mark } }
            await markController.postMarks(req, res)
            expect(User.updateOne).toHaveBeenCalledWith({ userId }, set, unset)
        })
        it("User updateOne가 400과 응답값을 잘 리턴하는가?", async () => {
            User.updateOne.mockReturnValue(null)
            result = { message: "북마크 수정에 실패하였습니다." }
            await markController.postMarks(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData()).toStrictEqual(result)
        })
        it("User updateOne가 200과 응답값을 잘 리턴하는가?", async () => {
            User.findOne.mockReturnValue(beforeMarks)
            User.updateOne.mockReturnValue(mark)
            const updateResult = { message: "SUCCESS" }
            await markController.postMarks(req, res)
            expect(res._isEndCalled()).toBeTruthy()
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData()).toStrictEqual(updateResult)
        })
    })

    describe("deleteMarks 관련 테스트", () => {
        it("User findOne이 잘 되는가?", async () => {
            req.body.dataId = dataId
            req.params.userId = userId
            await markController.deleteMarks(req, res)
            const option = { _id: false, mark: true }
            expect(User.findOne).toHaveBeenCalledWith({ userId }, option)
        })
        it("User update가 잘 되는가?", async () => {
            req.body.dataId = dataId
            req.params.userId = userId
            User.findOne.mockReturnValue(mark)
            const deleteMark = { $pullAll: { mark: dataId } }
            await markController.deleteMarks(req, res)
            expect(User.updateOne).toHaveBeenCalledWith({ userId }, deleteMark)
        })
        it("User update가 200과 응답값을 잘 리턴하는가?", async () => {
            req.body.dataId = dataId
            req.params.userId = userId
            User.findOne.mockReturnValue(mark)
            User.updateOne.mockReturnValue(dataId)
            const deleteMarkResult = { result: "SUCCESS" }
            await markController.deleteMarks(req, res)
            expect(res.statusCode).toBe(200)
            expect(res._getJSONData()).toStrictEqual(deleteMarkResult)
        })
        it("User update가 400과 응답값을 잘 리턴하는가?", async () => {
            req.body.dataId = dataId
            req.params.userId = userId
            User.findOne.mockReturnValue(null)
            User.updateOne.mockReturnValue(null)
            const deleteMarkResult = { message: "북마크 삭제를 실패하였습니다." }
            await markController.deleteMarks(req, res)
            expect(res.statusCode).toBe(400)
            expect(res._getJSONData()).toStrictEqual(deleteMarkResult)
        })
    })
})
