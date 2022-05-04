const mainController = require("../main.controller")
const httpMocks = require("node-mocks-http")
const mainData = require("../../test/data/new-main.json")
jest.mock("../../schemas/user")
jest.mock("../../schemas/data")
const User = require("../../schemas/user")
const BokjiApi = require("../../schemas/data")
const userId = { userId: 1 }
// const mark = [1, 3, 5, 8, 9]
// const dataId = [1, 3, 5, 8, 9]
// const beforeMarks = [4, 8, 9, 5]

let req, res
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
})

// describe("메인페이지 테스트 코드", () => {
//     describe("getMain 테스트", () => {
//         it("User find 가 잘 실행이되나?", async () => {
//             req.query.userId = userId
//             const option = { _id: false, lifeCycle: true, target: true, obstacle: true }
//             await mainController.getMain(req, res)
//             expect(User.find).toBeCalledWith({ userId }, option)
//         })
//         it("BokjiAPI find 가 잘 실행이되나?", async () => {
//             req.query.userId = userId
//             User.find.mockReturnValue(lifeCycle)
//             findData = { dataId: mark.mark }
//             await mainController.getMain(req, res)
//             expect(BokjiApi.find).toBeCalledWith(findData, option)
//         })
//         it("showMark가 400과 응답값을 잘 리턴하는가?", async () => {
//             BokjiApi.find.mockReturnValue(null)
//             await markController.getMarks(req, res)
//             const markResult = { message: "북마크 데이터를 받아 오지 못했습니다." }
//             expect(res.statusCode).toBe(400)
//             expect(res._getJSONData()).toStrictEqual(markResult)
//         })
//         it("showMark가 200과 응답값을 잘 리턴하는가?", async () => {
//             User.findOne.mockReturnValue(mark)
//             BokjiApi.find.mockReturnValue(markData)
//             await markController.getMarks(req, res)
//             expect(res.statusCode).toBe(200)
//             expect(res._getJSONData()).toStrictEqual({ userMark: markData })
//         })
//     })
// })
