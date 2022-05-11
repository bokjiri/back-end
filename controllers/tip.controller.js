const fs = require("fs")
exports.postTips = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Tip']
    #swagger.summary = '버그 리포트'
    #swagger.description = '버그 리포트를 요청하면 로그를 남긴다.'
    ========================================================================================================*/
    try {
        const { dataId } = req.body
        const { userId } = res.locals
        if (!userId || !dataId) throw new Error()
        const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]
        const time = new Date().toTimeString().split(" ")[0]
        const data = "\nuserId: " + userId.toString() + " dataId: " + dataId.toString() + " ||" + " Date: " + date + " Time: " + time

        fs.writeFile(process.env.TIPLOG || `./tip_log.txt`, data, { flag: "a+" }, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "상세페이지 조회 성공" }
        }
        =====================================================================================*/
        res.status(200).json({ result: "SUCCESS", message: "버그 리포트 성공" })
    } catch (err) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "상세페이지 조회 실패" }
        }
        =====================================================================================*/
        return next({
            message: "버그 리포트 실패",
            stack: err,
        })
    }
}
