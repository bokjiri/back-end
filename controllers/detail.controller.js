const { findData } = require("../services/detail.service")

exports.getDetail = async (req, res) => {
    try {
        const dataId = parseInt(req.params.dataId)
        const { name, link, summary, support, lifeCycle } = await findData(dataId)
        const data = { name, lifeCycle, summary, support, link }
        res.status(201).json({
            result: true,
            message: "상세페이지 조회 완료",
            data,
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            result: false,
            message: "상세페이지 조회 중 오류가 발생했습니다.",
        })
    }
}
