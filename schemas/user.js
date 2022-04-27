const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    target: {
        type: [Number],
    },
    obstacle: {
        type: [Number],
    },
    lifeCycle: {
        type: [Number],
    },
    mark: {
        type: [Number],
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

module.exports = mongoose.model("User", userSchema)
