const { newsDataList } = require("../services/news.service")

exports.getNews = async (req, res) => {
    const newsList = await newsDataList()
    res.status(200).json({ newsList })
}
