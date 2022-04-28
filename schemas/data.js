const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")
const dataSchema = mongoose.Schema({
    desire: {
        type: [String],
    },
    target: {
        type: [String],
    },
    obstacle: {
        type: [String],
    },
    lifeCycle: {
        type: [String],
    },
    name: {
        type: String,
    },
    link: {
        type: String,
    },
    institution: {
        type: String,
    },
    summary: {
        type: String,
    },
    support: {
        type: String,
    },
})
autoIdSetter(dataSchema, mongoose, "dataSchema", "dataId")
module.exports = mongoose.model("Data", dataSchema)
