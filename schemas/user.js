const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")
const userSchema = mongoose.Schema({
    age: {
        type: Number,
    },
    marriage: {
        type: [String],
    },
    lifeCycle: {
        type: [String],
    },
    gender: {
        type: [String],
    },
    region: {
        type: [String],
    },
    disability: {
        type: [String],
    },
    obstacle: {
        type: [String],
    },
    scholarship: {
        type: [String],
    },
    job: {
        type: [String],
    },
    workType: {
        type: [String],
    },
    family: {
        type: Number,
    },
    salary: {
        type: Number,
    },
    target: {
        type: [String],
    },
    mark: {
        type: [Number],
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
        default: '"http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg"',
    },
    dismatchData: {
        type: [Number],
    },
    password: {
        type: String,
    },
    kakao: {
        type: String,
    },
})
autoIdSetter(userSchema, mongoose, "userSchema", "userId")
module.exports = mongoose.model("User", userSchema)
