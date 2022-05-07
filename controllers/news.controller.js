const { newsDataList } = require("../services/news.service")

exports.getNews = async (req, res) => {
    try {
        const newsList = await newsDataList()
        res.status(200).json({ newsList })
    } catch (err) {
        res.status(400).json({ message: "뉴스데이터 조회 실패" })
    }
}
