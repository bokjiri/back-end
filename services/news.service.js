require("dotenv").config()
const News = require("../schemas/news")
const Client = require("../schemas/redis")
const axios = require("axios")
const cheerio = require("cheerio")
const schedule = require("node-schedule")

async function redisSet() {
    const NewsDataList = await News.find({}, { _id: false, newsId: false, __v: false })
    const newsData = JSON.stringify(NewsDataList)
    await Client.set("newsData", newsData)
    await Client.expire("newsData", 3600)
}

exports.newsData = async () => {
    const rule = new schedule.RecurrenceRule()
    rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    rule.minute = 30
    rule.tz = "Asia/Seoul"
    // rule.second = 15
    schedule.scheduleJob(rule, () => {
        const getHTML = async (keyword) => {
            try {
                return await axios.get("https://search.naver.com/search.naver?where=news&sm=tab_jum&query= " + encodeURI(keyword))
            } catch (err) {}
        }

        const parsing = async (keyword) => {
            const html = await getHTML(keyword)
            const $ = cheerio.load(html.data)
            const newsList = $(".news_wrap")

            let news = []

            let createNews
            let updateNews
            const findNews = await News.find({}, { _id: false, newsId: true })

            newsList.each((idx, node) => {
                news.push({
                    title: $(node).find(".news_tit").text(),
                    desc: $(node).find(".dsc_txt_wrap").text(),
                    link: $(node).find(".news_tit").attr("href"),
                    date: $(node).find(".info_group span.info").text(),
                    image: $(node).find(".dsc_thumb .thumb").attr("src"),
                })
            })
            let sliceNews = news.slice(0, 8)
            for (let i = 0; i < sliceNews.length; i++) {
                let title = sliceNews[i].title
                let desc = sliceNews[i].desc
                let link = sliceNews[i].link
                let date = sliceNews[i].date
                let image = sliceNews[i].image

                if (findNews.length === 0) {
                    createNews = await News.create({ title, link, desc, date, image })
                } else {
                    updateNews = await News.updateOne({ newsId: news[i].newsId }, { $set: { title, link, desc, date, image } })
                }
                if (createNews) {
                    await redisSet()
                } else if (updateNews.acknowledged) {
                    await redisSet()
                }
            }
        }

        parsing("복지정책")
        console.log("news Data update....SUCCESS!")
    })
}

exports.newsDataList = async () => {
    try {
        const findNewsDataList = await News.find({}, { _id: false, newsId: false, __v: false })
        return findNewsDataList
    } catch (err) {
        throw new Error()
    }
}
