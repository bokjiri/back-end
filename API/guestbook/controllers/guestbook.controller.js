const { userInfo, getGuestbook, topMark, createFeed, updateFeed, destroyFeed, reportFeed } = require("../services/guestbook.service")
exports.getGuestbook = async (req, res, next) => {
    try {
        const { userId } = res.locals
        const markRanking = await topMark(userId)
        const guestbook = []
        const checkGuestbook = await getGuestbook()
        for (let i of checkGuestbook) {
            guestbook.push({ nickname: i.nickname, profileUrl: i.profileUrl, date: i.date, content: i.content })
        }
        res.status(200).json({
            result: "SUCCESS",
            message: "방명록 피드 조회 성공",
            guestbook,
            markRanking,
        })
    } catch (err) {
        if (err.message) {
            return next({
                message: err.message,
                stack: err.stack,
            })
        } else {
            return next({
                message: "방명록 피드 조회 실패",
                stack: err.stack,
            })
        }
    }
}
exports.postFeed = async (req, res, next) => {
    try {
        const { userId } = res.locals
        const { content } = req.body
        if (!content) throw new Error("내용을 입력해 주세요")
        const user = await userInfo(userId)
        const checkFeed = await createFeed(content, user)
        res.status(200).json({
            result: "SUCCESS",
            message: "방명록 피드 작성 성공",
            dateNow: checkFeed.date,
        })
    } catch (err) {
        if (err.message) {
            return next({
                message: err.message,
                stack: err.stack,
            })
        } else {
            return next({
                message: "방명록 피드 작성 실패",
                stack: err.stack,
            })
        }
    }
}
exports.putFeed = async (req, res, next) => {
    try {
        const { userId } = res.locals
        const feedId = parseInt(req.params.feedId)
        const { content } = req.body

        const user = await userInfo(userId)
        const updateDate = await updateFeed(feedId, content, user)

        res.status(200).json({
            result: "SUCCESS",
            message: "방명록 피드 수정 성공",
            updateDate,
        })
    } catch (err) {
        if (err.message) {
            return next({
                message: err.message,
                stack: err.stack,
            })
        } else {
            return next({
                message: "방명록 피드 수정 실패",
                stack: err.stack,
            })
        }
    }
}
exports.deleteFeed = async (req, res, next) => {
    try {
        const feedId = parseInt(req.params.feedId)
        await destroyFeed(feedId)

        res.status(200).json({
            result: "SUCCESS",
            message: "방명록 피드 삭제 성공",
        })
    } catch (err) {
        if (err.message) {
            return next({
                message: err.message,
                stack: err.stack,
            })
        } else {
            return next({
                message: "방명록 피드 삭제 실패",
                stack: err.stack,
            })
        }
    }
}
exports.postReportFeed = async (req, res, next) => {
    try {
        const { userId } = res.locals
        const feedId = parseInt(req.params.feedId)
        const user = await userInfo(userId)
        const reportStat = await reportFeed(feedId, user)
        if (reportStat) {
            return res.status(200).json({
                result: "SUCCESS",
                message: "방명록 피드 신고 누적으로 피드가 삭제 되었습니다.",
            })
        }
        res.status(200).json({
            result: "SUCCESS",
            message: "방명록 피드 신고 성공",
        })
    } catch (err) {
        if (err.message) {
            return next({
                message: err.message,
                stack: err.stack,
            })
        } else {
            return next({
                message: "방명록 피드 신고 실패",
                stack: err.stack,
            })
        }
    }
}
