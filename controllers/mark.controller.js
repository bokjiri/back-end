const {
    showMark,
    pushMark,
    showMarkRedis,
    pushMarkRedis,
    dataCheck,
    deleteMark,
    deleteMarkRedis,
} = require("../services/mark.service")
const { checkBookmark } = require("../policies/services/detail.service")

exports.getMarks = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Mark']
    #swagger.summary = '북마크 조회'
    #swagger.description = '내가 북마크한 모든 정책을 조회한다.'
    ========================================================================================================*/
    try {
        const localsUserId = res.locals.userId
        const paramsUserId = req.params.userId
        if (localsUserId !== parseInt(paramsUserId)) throw new Error("누구니???")
        const userMark = await showMark(localsUserId)
        await showMarkRedis(localsUserId)

        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "북마크 조회 성공", userMark }
        }
        =====================================================================================*/
        res.status(200).json({
            result: "SUCCESS",
            message: "북마크 조회 성공",
            userMark,
        })
    } catch (err) {
        // console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "북마크 조회 실패" }
        }
        =====================================================================================*/
        // res.status(400).json({ result: "FAIL", message: "북마크 조회 실패" })
        if (err.message) {
            return next({
                message: err.message,
                stack: err,
            })
        } else {
            return next({
                message: "북마크 조회 실패",
                stack: err,
            })
        }
    }
}

exports.postMarks = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Mark']
    #swagger.summary = '북마크 추가'
    #swagger.description = '정책을 내 북마크 목록에 추가한다.'
    ========================================================================================================*/
    try {
        const { userId } = res.locals
        const { dataId } = req.body
        if (!userId || !dataId) throw new Error("userId , dataId를 확인 해주세요")
        const check = await pushMark(userId, dataId)

        if (!check) throw new Error("이미 추가한 북마크 데이터입니다.")

        let data = await dataCheck(dataId)
        const { mark } = await checkBookmark(userId)

        for (i of mark) {
            if (i === parseInt(dataId)) data.bookmarkState = true
        }

        await pushMarkRedis(userId)

        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "북마크 추가 성공" }
        }
        =====================================================================================*/
        res.status(201).json({ result: "SUCCESS", message: "북마크 추가 삭제 성공", data })
    } catch (err) {
        // console.log(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "북마크 추가 실패" }
        }
        =====================================================================================*/
        // res.status(400).json({ result: "FAIL", message: "북마크 추가 실패" })
        if (err.message) {
            return next({
                message: err.message,
                stack: err,
            })
        } else {
            return next({
                message: "북마크 추가 삭제 실패",
                stack: err,
            })
        }
    }
}

exports.deleteMarks = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Mark']
    #swagger.summary = '북마크 삭제'
    #swagger.description = '정책을 내 북마크 목록에서 삭제한다.'
    ========================================================================================================*/
    try {
        const { dataId } = req.params
        const { userId } = res.locals
        const check = await deleteMark(userId, dataId)
        if (!check) throw new Error("삭제할 데이터가 없습니다.")

        let data = await dataCheck(dataId)

        const { mark } = await checkBookmark(userId)
        for (i of mark) {
            if (i === parseInt(dataId)) data.bookmarkState = true
        }
        deleteMarkRedis(userId)
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "북마크 삭제 성공" }
        }
        =====================================================================================*/
        res.status(201).json({ result: "SUCCESS", message: "북마크 삭제 성공", data })
    } catch (err) {
        // console.error(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "북마크 삭제 실패" }
        }
        =====================================================================================*/
        if (err.message) {
            return next({
                message: err.message,
                stack: err,
            })
        } else {
            return next({
                message: "북마크 삭제 실패",
                stack: err,
            })
        }
    }
}

// exports.likeMarks = async (req, res) => {
//     /*========================================================================================================
//     #swagger.tags = ['Mark']
//     #swagger.summary = '좋아요 - 사용 x'
//     #swagger.description = '정책을 좋아요한다.'
//     ========================================================================================================*/
//     try {
//         const { userId } = req.params
//         const { dataId } = req.body
//         await likemark(userId, dataId)
//         /*=====================================================================================
//         #swagger.responses[201] = {
//             description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
//             schema: { result: "SUCCESS", message: "좋아요 성공" }
//         }
//         =====================================================================================*/
//         res.status(201).json({ result: "SUCCESS", message: "좋아요 성공" })
//     } catch (err) {
//         /*=====================================================================================
//         #swagger.responses[400] = {
//             description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
//             schema: { result: "FAIL", message: "좋아요 실패" }
//         }
//         =====================================================================================*/
//         res.status(400).json({ result: "FAIL", message: "좋아요 실패" })
//     }
// }

// exports.topMarks = async (req, res) => {
//     /*========================================================================================================
//     #swagger.tags = ['Mark']
//     #swagger.summary = 'topMarkList 조회'
//     #swagger.description = 'topMarkList를 조회한다.'
//     ========================================================================================================*/
//     try {
//         const { userId } = req.body
//         const topMarkList = await topMark(userId)
//         await topLikesMarkRedis(userId)
//         /*=====================================================================================
//         #swagger.responses[200] = {
//             description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
//             schema: { result: "SUCCESS", message: "topMarkList 조회 성공", MarkList: topMarkList }
//         }
//         =====================================================================================*/
//         res.status(200).json({ result: "SUCCESS", message: "topMarkList 조회 성공", MarkList: topMarkList })
//     } catch (err) {
//         /*=====================================================================================
//         #swagger.responses[400] = {
//             description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
//             schema: { result: "FAIL", message: "topMarkList 조회 실패" }
//         }
//         =====================================================================================*/
//         res.status(400).json({ result: "FAIL", message: "topMarkList 조회 실패" })
//     }
// }
