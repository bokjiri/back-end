require("dotenv").config()
const News = require("../../../schemas/news")
const User = require("../../../schemas/user")
const Client = require("../../../schemas/redis")
const axios = require("axios")
const cheerio = require("cheerio")

async function redisSet(userId, userNewsList) {
    const jsonNewsData = JSON.stringify(userNewsList)
    await Client.set(`newsData${userId}`, jsonNewsData)
    await Client.expire(`newsData${userId}`, 3600)
}

exports.dataParsing = async (userId) => {
    const getHTML = async (keyword) => {
        try {
            // if (type === "관련도순") {
            return await axios.get(`https://search.naver.com/search.naver?where=news&query=` + encodeURI(keyword))
            // } else if (type === "최신순") {
            //     return await axios.get(
            //         `https://search.naver.com/search.naver?where=news&query=${encodeURI(
            //             keyword
            //         )}&sm=tab_opt&sort=1&photo=0&field=0&pd=0&ds=&de=&docid=&related=0&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so%3Add%2Cp%3Aall&is_sug_officeid=0`
            //     )
            // }
        } catch (err) {
            // console.log(err)
        }
    }
    exports.parsing = async (keyword) => {
        // if (type === "관련도순") {
        const html = await getHTML(keyword)
        const $ = cheerio.load(html.data)
        const newsList = $(".news_wrap")
        // console.log("newsList: " + newsList)
        let news = []

        let createNews
        let updateNews
        const findNews = await News.find({ userId }, { _id: false, newsId: true })

        newsList.each((idx, node) => {
            news.push({
                title: $(node).find(".news_tit").text(),
                desc: $(node).find(".dsc_txt_wrap").text(),
                link: $(node).find(".news_tit").attr("href"),
                date: $(node).find(".info_group span.info").text(),
                image: $(node).find(".dsc_thumb .thumb").attr("src"),
            })
        })
        // console.log("news: " + news)

        let sliceNews = news.sort().slice(0, 8)
        // console.log("sliceNews: " + sliceNews)
        let userNewsList = []
        for (let i = 0; i < sliceNews.length; i++) {
            let title = sliceNews[i].title
            let desc = sliceNews[i].desc
            let link = sliceNews[i].link
            let date = sliceNews[i].date
            let image = sliceNews[i].image
            userNewsList.push({ title, link, desc, date, image })
            // console.log(title, desc, link, date, image)
        }
        // console.log("userNewsList: " + userNewsList)
        // console.log(userNewsList)
        if (findNews.length === 0) {
            createNews = await News.create({ news: userNewsList, userId })
            await redisSet(userId, userNewsList)
            // console.log(userNewsList)
        } else if (findNews.length) {
            updateNews = await News.updateOne({ userId }, { $set: { news: userNewsList } })
            await redisSet(userId, userNewsList)
            // console.log(userNewsList)
        }
    }
    const userRegion = await User.findOne({ userId }, { _id: false, region: true })
    if (userRegion.region.length === 0) {
        await this.parsing("복지정책")
    } else {
        const region = userRegion.region[0]
        await this.parsing(`${region} 복지정책`)
    }
}

exports.newsDataList = async (userId) => {
    try {
        await this.dataParsing(userId)
        const newsData = await News.find({ userId }, { _id: false, newsId: false, __v: false })
        const newsArr = []
        newsData.map((value) => {
            value.news.map((data) => {
                newsArr.push({ title: data.title, link: data.link, date: data.date, desc: data.desc, image: data.image })
            })
        })
        return newsArr
    } catch (err) {
        // console.log(err)
    }
}
