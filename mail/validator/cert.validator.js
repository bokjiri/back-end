const { body, validationResult } = require("express-validator")

const error = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    return res.status(400).json({ result: "fail", errorMessage: errors.array()[0].msg })
}

const certValidation = [body("authCode").notEmpty().isInt(), error]

module.exports = certValidation
