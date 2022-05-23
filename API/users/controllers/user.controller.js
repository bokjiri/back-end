const userService = require("../services/user.service")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}
exports.createUser = async (req, res, next) => {
    try {
        const { email, nickname, password } = req.body
        const exEmail = await userService.checkByEmail(email)
        if (exEmail) throw new ValidationError("이미 가입한 이메일입니다.")
        const hashPassword = await bcrypt.hash(password, 12)
        await userService.createItselfUser(email, nickname, hashPassword)
        res.status(201).json({
            result: true,
            message: "회원가입완료",
        })
    } catch (error) {
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "회원정보 조회 중 오류가 발생했습니다.",
                stack: error.stack,
            })
        }
    }
}
exports.authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await userService.checkByEmail(email)
        if (!user) throw new ValidationError("일치하는 회원이 없습니다")
        if (!user.password) throw new ValidationError("일치하는 회원이 없습니다")
        if (bcrypt.compareSync(password, user.password)) {
            const { userId, nickname, profileUrl, email } = user
            const payload = { userId, nickname, profileUrl, email }
            const accessToken = jwt.sign(payload, process.env.ACCESSKEY, {
                expiresIn: process.env.ATOKENEXPIRE,
            })
            const refreshToken = jwt.sign({ userId }, process.env.REFRESHKEY, {
                expiresIn: process.env.RTOKENEXPIRE,
            })
            return res.status(200).json({
                result: true,
                message: "로그인완료",
                accessToken,
                refreshToken,
            })
        } else {
            throw new ValidationError("일치하는 회원이 없습니다")
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "회원정보 조회 중 오류가 발생했습니다.",
                stack: error.stack,
            })
        }
    }
}

exports.getUsers = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['User']
    #swagger.summary = '회원정보 조회'
    #swagger.description = '회원정보를 조회한다.'
    ========================================================================================================*/
    try {
        const userId = parseInt(req.params.userId)
        const tokenUserId = res.locals.userId
        if (tokenUserId !== userId) throw new ValidationError("토큰하고 유저아이디가 다름 비정상적인 접근")

        const data = await userService.checkById(userId)
        if (!data) throw new ValidationError("회원정보가 없음")

        if (data.region.length === 1) data.region[1] = "시·군을 선택해 주세요"
        if (data.region.length === 0) {
            data.region[0] = "시·도를 선택해 주세요"
            data.region[1] = "시·군을 선택해 주세요"
        }
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: {
            result: true,
            message: "회원정보 조회 완료",
            data,
        }
        }
        =====================================================================================*/
        res.status(201).json({
            result: true,
            message: "회원정보 조회 완료",
            data,
        })
    } catch (error) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "회원정보 조회 중 오류가 발생했습니다." }
        }
        =====================================================================================*/
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "회원정보 조회 중 오류가 발생했습니다.",
                stack: error.stack,
            })
        }
    }
}

exports.patchUsers = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['User']
    #swagger.summary = '회원정보 수정'
    #swagger.description = '회원정보를 수정한다.'
    ========================================================================================================*/
    try {
        const userId = parseInt(req.params.userId)
        const tokenUserId = res.locals.userId
        if (tokenUserId !== userId) throw new ValidationError("토큰하고 유저아이디가 다름 비정상적인 접근")

        const { age, gender, region, disability, obstacle, marriage, target, salary, scholarship, family, workType } = req.body

        let job = req.body.job
        if (job === "미취업") job = "미취업자"

        let arrRegion = region.split(" ")

        if (arrRegion.length === 4) {
            arrRegion = arrRegion[0]
            if (arrRegion === "-------") arrRegion = []
        } else if (arrRegion.length > 4) {
            arrRegion = []
        }

        const result = await userService.updateUserInfo(userId, age, gender, arrRegion, disability, obstacle, job, marriage, target, salary, scholarship, family, workType)

        if (!result) throw new ValidationError("db에서 update 실패")
        /*=====================================================================================
        #swagger.responses[201] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: {
            result: true,
            message: "회원정보 수정 완료",
        }
        }
        =====================================================================================*/
        res.status(201).json({
            result: true,
            message: "회원정보 수정 완료",
        })
    } catch (error) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "회원정보 수정 중 오류가 발생했습니다." }
        }
        =====================================================================================*/
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "회원정보 수정 중 오류가 발생했습니다.",
                stack: error.stack,
            })
        }
    }
}
exports.deleteUsers = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['User']
    #swagger.summary = '회원정보 삭제'
    #swagger.description = '회원정보를 삭제한다.'
    ========================================================================================================*/
    try {
        const userId = parseInt(req.params.userId)
        const tokenUserId = res.locals.userId
        if (tokenUserId !== userId) throw new ValidationError("토큰하고 유저아이디가 다름 비정상적인 접근")

        const result = await userService.deleteUserInfo(userId)
        if (!result) throw new ValidationError("db에서 delete 실패")
        /*=====================================================================================
        #swagger.responses[204] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: {
            result: true,
            message: "회원정보 삭제 완료",
            data,
        }
        }
        =====================================================================================*/
        res.status(204).json({
            result: true,
            message: "회원정보 삭제 완료",
        })
    } catch (error) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "회원정보 삭제 중 오류가 발생했습니다." }
        }
        =====================================================================================*/
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "회원정보 삭제 중 오류가 발생했습니다.",
                stack: error.stack,
            })
        }
    }
}
exports.kakaoCallback = async (req, res) => {
    try {
        const { user } = req.session.passport
        const { userId, nickname, profileUrl, email } = user
        const payload = { userId, nickname, profileUrl, email }
        const accessToken = jwt.sign(payload, process.env.ACCESSKEY, {
            expiresIn: process.env.ATOKENEXPIRE,
        })
        const refreshToken = jwt.sign({ userId }, process.env.REFRESHKEY, {
            expiresIn: process.env.RTOKENEXPIRE,
        })
        res.status(200).json({ result: true, accessToken, refreshToken })
    } catch (error) {
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "카카오 로그인중 오류가 발생했습니다.",
                stack: error.stack,
            })
        }
    }
}
