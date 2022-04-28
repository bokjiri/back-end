const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")
const userSchema = mongoose.Schema({
    target: {
        type: [String],
    },
    obstacle: {
        type: [String],
    },
    lifeCycle: {
        type: [String],
    },
    mark: {
        type: [String],
    },
    email: {
        type: String,
    },
    nickname: {
        type: String,
    },
    profileUrl: {
        type: String,
    },
})
autoIdSetter(userSchema, mongoose, "userSchema", "userId")
module.exports = mongoose.model("User", userSchema)
