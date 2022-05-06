const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")
const userSchema = mongoose.Schema({
    lifeCycle: {
        type: Number,
    },
    gender: {
        type: String,
    },
    region: {
        type: String,
    },
    disability: {
        type: Boolean,
    },
    obstacle: {
        type: [String],
    },
    scholarship: {
        type: [String],
    },
    job: {
        type: String,
    },
    salary: {
        type: Number,
    },
    target: {
        type: [String],
    },
    mark: {
        type: [String],
    },
    likeMark: {
        type: [Number],
    },
    topLikeMarkList: [{ desire: String, name: String, dataId: Number }],

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
