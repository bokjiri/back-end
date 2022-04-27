const mongoose = require("mongoose")

const dataSchema = mongoose.Schema({
    dataId: {
        type: Number,
        required: true,
    },
    desire: {
        type: [Number],
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

module.exports = mongoose.model("Data", dataSchema)
