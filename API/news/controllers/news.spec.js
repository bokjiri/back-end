const httpMocks = require("node-mocks-http")
const newsController = require("./news.controller")
const newsService = require("../services/news.service")
const axios = require("axios")
const cheerio = require("cheerio")

jest.mock("../../../schemas/news")
jest.mock("../../../schemas/user")
jest.mock("axios")
jest.mock("cheerio")

const News = require("../../../schemas/news")
const User = require("../../../schemas/user")

const userId = 1
const region = { region: ["서울특별시"] }
const axiosReturn = "html"

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest() //test코드에서 req, res를 사용하기 위해 httpMocks를 이용한다.
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe("뉴스데이터 테스트 코드", () => {
    it("getNews가 함수인가?", () => {
        expect(typeof newsController.getNews).toBe("function")
    })
    it("User.findOne 이 잘 실행되는가?", async () => {
        res.locals.userId = userId
        const option = { _id: false, region: true }
        await newsService.newsDataList(userId)
        expect(User.findOne).toBeCalledWith({ userId }, option)
    })
    it("axios.get 이 잘 실행되는가?", async () => {
        res.locals.userId = userId
        User.findOne.mockReturnValue(region)
        await newsService.newsDataList(userId)
        expect(axios.get).toBeCalledTimes(1)
    })
    it("cheerio.load 이 잘 실행되는가?", async () => {
        res.locals.userId = userId
        User.findOne.mockReturnValue(region)
        const html = axios.get.mockReturnValue(axiosReturn)
        await newsService.newsDataList(userId)
        expect(cheerio.load).toBeCalledWith(html.data)
    })
    // const keyword = "복지정책"
    // const url = `https://search.naver.com/search.naver?where=news&query=` + encodeURI(keyword)
    // it("cheerio.load 이 잘 실행되는가?", async () => {
    //     res.locals.userId = userId
    //     User.findOne.mockReturnValue(region)
    //     const html = axios.get.mockReturnValue(axiosReturn)
    //     let $ = cheerio.load(html.data)
    //     $ = jest.fn()
    //     await newsService.newsDataList(userId)
    //     expect(typeof $).toBe("function")
    // })
})
