const { newsDataList } = require("../services/news.service")
exports.getNews = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['News']
    #swagger.summary = '뉴스 데이터 조회'
    #swagger.description = '뉴스 데이터를 조회한다.'
    ========================================================================================================*/
    try {
        const { userId } = res.locals
        const newsList = await newsDataList(userId)
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "뉴스 데이터 조회 성공", newsList }
        }
        =====================================================================================*/
        res.status(200).json({ result: "SUCCESS", newsList })
    } catch (err) {
        // console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "뉴스 데이터 조회 실패" }
        }
        =====================================================================================*/
        return next({
            message: "뉴스 데이터 조회 실패",
            stack: err.stack,
        })
    }
}
