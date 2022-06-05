const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")
const chatSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
})

autoIdSetter(chatSchema, mongoose, "chatSchema", "chatId")
module.exports = mongoose.model("chat", chatSchema)
