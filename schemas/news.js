const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")

const news = mongoose.Schema({
    news: { type: [{ title: String, link: String, date: String, desc: String, image: String }] },

    type: {
        type: String,
    },
    userId: {
        type: String,
    },
})
autoIdSetter(news, mongoose, "news", "newsId")
module.exports = mongoose.model("news", news)
