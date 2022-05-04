const request = require("request")
const Client = require("../schemas/redis")
require("dotenv").config()
const NAVER_CLIENT_ID = process.env.CLIENTID
const NAVER_CLIENT_SECRET = process.env.CLIENTSECRET
// const schedule = require("node-schedule")

const option = {
    query: "복지정책", //이미지 검색 텍스트
    start: 1, //검색 시작 위치
    display: 10,
    sort: "sim", //정렬 유형 (sim:유사도)
}

exports.newsData = () => {
    // const rule = new schedule.RecurrenceRule()
    // rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    // rule.minute = 30
    // rule.second = 30
    return new Promise((resolve, reject) => {
        let result = []
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
                originNewsData.items.map((value) => {
                    const myRegExp1 = /<[^>]*>?/g
                    htmlTxt = value.title.replace(myRegExp1, "")
                    result.push({ title: value.title.replace(myRegExp1, ""), link: value.originallink, desc: value.description.replace(myRegExp1, ""), date: value.pubDate })
                })
                resolve(result)
                const newsData = JSON.stringify(result)

                Client.set("newsData", newsData)
                // Client.expire("newsData", 3600)
            }
        )
        // })
    })
}

exports.getNews = async (req, res) => {
    const newsData = await this.newsData()
    res.status(200).json({ newsData })
}
