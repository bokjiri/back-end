const { checkUserData } = require("../services/main.service")

exports.getMain = async (req, res) => {
    const { userId } = req.query
    try {
        let [checkedData] = await checkUserData(userId)
        return res.status(200).json({
            result: "SUCCESS",
            message: "추천 조회 성공",
            checkedData,
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            result: "FAIL",
            message: "실패",
        })
    }
}
