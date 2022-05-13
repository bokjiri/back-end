const { showMark, pushMark, deleteMark, topMark, likemark, showMarkRedis, pushMarkRedis, deleteMarkRedis, topLikesMarkRedis } = require("../services/mark.service")

exports.getMarks = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Mark']
    #swagger.summary = '북마크 조회'
    #swagger.description = '내가 북마크한 모든 정책을 조회한다.'
    ========================================================================================================*/
    try {
        const localsUserId = res.locals.userId
        const paramsUserId = req.params.userId
        if (localsUserId !== parseInt(paramsUserId)) throw new Error()
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
        console.error(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "북마크 조회 실패" }
        }
        =====================================================================================*/
        // res.status(400).json({ result: "FAIL", message: "북마크 조회 실패" })
        return next({
            message: "북마크 조회 실패",
            stack: err,
        })
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
        const checkMark = await pushMark(userId, dataId)
        await pushMarkRedis(userId)
        if (!checkMark) throw new Error()
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "북마크 추가 성공" }
        }
        =====================================================================================*/
        res.status(201).json({ result: "SUCCESS", message: "북마크 추가 성공" })
    } catch (err) {
        console.error(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "북마크 추가 실패" }
        }
        =====================================================================================*/
        // res.status(400).json({ result: "FAIL", message: "북마크 추가 실패" })
        return next({
            message: "북마크 추가 실패",
            stack: err,
        })
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
        if (!check) {
            /*=====================================================================================
        #swagger.responses[404] = {
            description: '입력 받은 userId와 dataId에 해당하는 북마크 데이터가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", code: -11, 'message': "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
            return res.status(404).json({ result: "FAIL", code: -11, message: "데이터베이스 조회 실패" })
        }
        deleteMarkRedis(userId)
        /*=====================================================================================
        #swagger.responses[204] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "북마크 삭제 성공" }
        }
        =====================================================================================*/
        res.status(204).json({ result: "SUCCESS", message: "북마크 삭제 성공" })
    } catch (err) {
        console.error(err)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "북마크 삭제 실패" }
        }
        =====================================================================================*/
        return next({
            message: "북마크 삭제 실패",
            stack: err,
        })
    }
}

exports.likeMarks = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['Mark']
    #swagger.summary = '북마크 ??'
    #swagger.description = '정책을 내 북마크 목록에서 ??한다.'
    ========================================================================================================*/
    try {
        const { userId } = req.params
        const { dataId } = req.body
        await likemark(userId, dataId)
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "북마크 ?? 성공" }
        }
        =====================================================================================*/
        res.status(201).json({ result: "SUCCESS", message: "북마크 ?? 성공" })
    } catch (err) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "북마크 ?? 실패" }
        }
        =====================================================================================*/
        res.status(400).json({ result: "FAIL", message: "북마크 ?? 실패" })
    }
}

exports.topMarks = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['Mark']
    #swagger.summary = 'topMarkList 조회'
    #swagger.description = 'topMarkList를 조회한다.'
    ========================================================================================================*/
    try {
        const { userId } = req.body
        const topMarkList = await topMark(userId)
        await topLikesMarkRedis(userId)
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "topMarkList 조회 성공", MarkList: topMarkList }
        }
        =====================================================================================*/
        res.status(200).json({ result: "SUCCESS", message: "topMarkList 조회 성공", MarkList: topMarkList })
    } catch (err) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "topMarkList 조회 실패" }
        }
        =====================================================================================*/
        res.status(400).json({ result: "FAIL", message: "topMarkList 조회 실패" })
    }
}
