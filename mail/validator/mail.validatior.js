const { body, validationResult } = require("express-validator")

const error = (req, res, next) => {
    const errors = validationResult(req)
    console.log("validateError : ", errors["errors"])
    if (errors.isEmpty()) {
        return next()
    }
    console.log(errors.array()[0].msg)
    return res.status(400).json({ result: "fail", errorMessage: errors.array()[0].msg })
}

const mailValidation = [body("email").notEmpty().isEmail(), error]

module.exports = mailValidation
