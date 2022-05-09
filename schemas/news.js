const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")

const news = mongoose.Schema({
    title: {
        type: String,
    },
    link: {
        type: String,
    },
    desc: {
        type: String,
    },
    date: {
        type: String,
    },
    image: {
        type: String,
    },
})
autoIdSetter(news, mongoose, "news", "newsId")
module.exports = mongoose.model("news", news)
