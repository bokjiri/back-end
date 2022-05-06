const mongoose = require("mongoose")
const autoIdSetter = require("./autoidsetter")
const dataSchema = mongoose.Schema({
    lifeCycle: {
        type: [String],
    },
    age: {
        type: [Number],
    },
    gender: {
        type: [String],
    },
    region: {
        type: String,
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
    marriage: {
        type: String,
    },
    children: {
        type: Number,
    },
    household: {
        type: Number,
    },
    salary: {
        type: Number,
    },
    target: {
        type: [String],
    },
    desire: {
        type: String,
    },
    name: {
        type: String,
    },
    summary: {
        type: String,
    },
    support: {
        type: String,
    },
    period: {
        type: String,
    },
    institution: {
        type: String,
    },
    link: {
        type: String,
    },
})
autoIdSetter(dataSchema, mongoose, "dataSchema", "dataId")
module.exports = mongoose.model("Data", dataSchema)
