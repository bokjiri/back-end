const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")
const guestbookSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    profileUrl: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    report: {
        type: [Number],
    },
})

autoIdSetter(guestbookSchema, mongoose, "guestbookSchema", "feedId")
module.exports = mongoose.model("guestbook", guestbookSchema)
