const request = require("request")
const News = require("../schemas/news")
const Client = require("../schemas/redis")
require("dotenv").config()
const NAVER_CLIENT_ID = process.env.CLIENTID
const NAVER_CLIENT_SECRET = process.env.CLIENTSECRET
// const schedule = require("node-schedule")

const option = {
    query: "복지정책", //이미지 검색 텍스트
    start: 1, //검색 시작 위치
    display: 8,
    sort: "sim", //정렬 유형 (sim:유사도)
}

async function redisSet() {
    const NewsDataList = await News.find({}, { _id: false, newsId: false, __v: false })
    const newsData = JSON.stringify(NewsDataList)
    await Client.set("newsData", newsData)

    // await Client.expire("newsData", 3600)
}

exports.newsData = () => {
    // const rule = new schedule.RecurrenceRule()
    // rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    // rule.minute = 30
    // rule.second = 30
    return new Promise((resolve, reject) => {
        // schedule.scheduleJob(rule, () => {
        request.get(
            {
                uri: "https://openapi.naver.com/v1/search/news.json", //xml 요청 주소는 https://openapi.naver.com/v1/search/image.xml
                qs: option,
                headers: {
                    "X-Naver-Client-Id": NAVER_CLIENT_ID,
                    "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
                },
            },
            async function (err, res, body) {
                let originNewsData = JSON.parse(body) //json으로 파싱
                let newsList = originNewsData.items
                const news = await News.find({}, { _id: false, newsId: true })
                const myRegExp1 = /<[^>]*>?/g
                const myRegExp2 = /&quot;/g
                let createNews
                let updateNews
                for (let i = 0; i < newsList.length; i++) {
                    const title = newsList[i].title.replace(myRegExp1, "").replace(myRegExp2, "")
                    const link = newsList[i].link
                    const desc = newsList[i].description.replace(myRegExp1, "").replace(myRegExp2, "")
                    const date = newsList[i].pubDate
                    if (news.length === 0) {
                        createNews = await News.create({ title, link, desc, date })
                    } else {
                        updateNews = await News.updateOne({ newsId: news[i].newsId }, { $set: { title, link, desc, date } })
                    }
                }
                const NewsDataList = await News.find({}, { _id: false, newsId: false, __v: false })
                if (createNews) {
                    await redisSet()
                } else if (updateNews.acknowledged) {
                    await redisSet()
                }
                await redisSet()
                resolve(NewsDataList)
            }
        )
        // })
    })
}

exports.getNews = async (req, res) => {
    const newsData = await this.newsData()
    res.status(200).json({ newsData })
}
