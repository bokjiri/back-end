require("dotenv").config()
const Data = require("../schemas/data")
const connect = require("../schemas")

connect()

async function findData() {
    const data = await Data.find({}, { _id: false })
    for (i of data) {
        if (i.lifeCycle.indexOf("청년") !== -1) {
            console.log(i.lifeCycle, i.name)
        }
    }
}

async function a() {
    const ab = await findData()
    console.log(ab)
}
a()
