const { searchService } = require("../services/search.service")

exports.postSearch = async (req, res) => {
    try {
        const { userId, searchKey, type } = req.body
        const { searchList } = await searchService(userId, searchKey, type)
        if (!searchList.length) return res.status(400).json({ message: "정책 키워드를 확인해 주세요" })
        res.status(200).json({ searchList })
    } catch (err) {
        res.status(400).json({ message: "정책 검색이 실패하였습니다." })
    }
}
