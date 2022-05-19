const { body, validationResult } = require("express-validator")
const moment = require("moment")
const ageValidate = moment().format("YYYYMMDD")
const { regionValidate, targetValidate, obstacleValidate, scholarshipValidate, workTypeValidate } = require("./validator.array")

const error = (req, res, next) => {
    const errors = validationResult(req)
    console.log("validateError : ", errors["errors"])
    if (errors.isEmpty()) {
        return next()
    }
    console.log(errors.array()[0].msg)
    return res.status(400).json({ result: "fail", errorMessage: errors.array()[0].msg })
}

const userValidation = [
    body("age")
        .notEmpty()
        .withMessage("내용을 입력해주세요")
        .isLength(8)
        .withMessage("생년월일은 8자")
        .isInt()
        .withMessage("숫자여야함")
        .custom((v) => {
            if (v > Number(ageValidate)) throw new Error()
            return true
        })
        .withMessage("미래에 태어난 사람은 안됨"),
    body("gender").isArray({ max: 1 }).withMessage("성별은 하나만 선택하세요").isIn(["여성", "남성", ""]).withMessage("성별은 빈값 또는 남성 또는 여성만"),
    body("region")
        .isString()
        .isIn([...regionValidate, ""])
        .withMessage("한국만"),
    body("disability").isArray({ max: 1 }).withMessage("하나만 선택하세요").isIn(["있음", "없음"]),
    body("obstacle")
        .isArray()
        .isIn([...obstacleValidate, ""]),
    body("job").isArray({ max: 1 }).withMessage("하나만 선택하세요").isIn(["미취업", "취업", ""]),
    body("marriage").isArray({ max: 1 }).withMessage("하나만 선택하세요"),
    body("target")
        .isArray({ max: 5 })
        .isIn([...targetValidate, ""]),
    body("scholarship")
        .isArray()
        .isIn([...scholarshipValidate, ""]),
    body("workType")
        .isArray()
        .isIn([...workTypeValidate, ""]),
    body("salary").isInt({ min: 0, max: 9999999999 }).withMessage("너무 많아"),
    body("family").isInt({ min: 0, max: 8 }),
    error,
]

module.exports = userValidation
