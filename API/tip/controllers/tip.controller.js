const { postipService } = require("../services/tip.service")
const userService = require("../../users/services/user.service")
// const fs = require("fs")
exports.postTips = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Tip']
    #swagger.summary = '정책 숨기기'
    #swagger.description = '정책 숨기기'를 요청하면 데이터를 추가한다..'
    ========================================================================================================*/
    try {
        const { dataId } = req.body
        const { userId } = res.locals
        if (!userId || !dataId) throw new Error("userId , dataId를 확인 해주세요")

        const checkTip = await postipService(userId, dataId)
        if (!checkTip) throw new Error("DB에 dataID가 없거나 이미 버그제보한 데이터입니다.")
        await userService.redisSetMain(userId)
        // const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]
        // const time = new Date().toTimeString().split(" ")[0]
        // const data = "\nuserId: " + userId.toString() + " dataId: " + dataId.toString() + " ||" + " Date: " + date + " Time: " + time

        // fs.writeFile(process.env.TIPLOG || `./tip_log.txt`, data, { flag: "a+" }, (err) => {

        // })
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "상세페이지 조회 성공" }
        }
        =====================================================================================*/
        res.status(200).json({ result: "SUCCESS", message: "정책 숨기기 성공" })
    } catch (err) {
        // console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "상세페이지 조회 실패" }
        }
        =====================================================================================*/
        if (err.message) {
            return next({
                message: err.message,
                stack: err,
            })
        } else {
            return next({
                message: "정책 숨기기 실패",
                stack: err,
            })
        }
    }
}
