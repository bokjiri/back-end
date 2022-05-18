const httpMocks = require("node-mocks-http")
const newsController = require("../news.controller")

jest.mock("../../schemas/news")
const news = require("../../schemas/news")

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe("뉴스데이터 테스트 코드", () => {
    it("뉴스데이터를 잘 가져오는가?", async () => {
        const option = { _id: false, newsId: false, __v: false }
        await newsController.getNews(req, res, next)
        expect(news.find).toBeCalledWith({}, option)
    })
})
