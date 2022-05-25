const { body, validationResult } = require("express-validator")
class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}
const error = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    } else {
        const error = new ValidationError(errors.array()[0].msg)
        return next({
            message: error.message,
            stack: error.stack,
        })
    }
}

const mailValidation = [body("email").notEmpty().isEmail(), error]

module.exports = mailValidation
