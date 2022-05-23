const { findData, checkBookmark } = require("../services/detail.service")
class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}
exports.getDetail = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Detail']
    #swagger.summary = '정책 상세 조회'
    #swagger.description = '정책 하나의 상세 내용을 조회합니다.'
    ========================================================================================================*/
    try {
        const dataId = parseInt(req.params.dataId)
        const { userId } = res.locals

        const data = await findData(dataId)
        if (!data) throw new ValidationError("data가 존재하지 않습니다.")

        const { mark } = await checkBookmark(userId)
        for (i of mark) {
            if (i === dataId) data.bookmarkState = true
        }
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { 
            result: "SUCCESS",
            message: "상세페이지 조회 성공",
            data,
            }
        }
        =====================================================================================*/
        res.status(200).json({
            result: "SUCCESS",
            message: "상세페이지 조회 성공",
            data,
        })
    } catch (error) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "상세페이지 조회 실패" }
        }
        =====================================================================================*/
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "상세페이지 조회 실패",
                stack: error.stack,
            })
        }
    }
}
