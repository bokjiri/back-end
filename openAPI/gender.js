require("dotenv").config()
const Data = require("../schemas/data")
const connect = require("../schemas")
connect()
const fs = require("fs")
fs.truncate("./openAPI/gender.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/gender.txt"))
let desire
let target
let obstacle
let lifeCycle
let name
let link
let institution
let summary
let support
let dataId

async function gender() {
    const dataList = await Data.find({})

    for (let i of dataList) {
        if (/여성/.test(i.name)) {
            desire = i.desire
            target = i.target
            obstacle = i.obstacle
            lifeCycle = i.lifeCycle
            name = i.name
            link = i.link
            institution = i.institution
            summary = i.summary
            support = i.support
            dataId = i.dataId
            myConsole.log({ gender: "여성" })
            myConsole.log({ desire })
            myConsole.log({ target })
            myConsole.log({ obstacle })
            myConsole.log({ lifeCycle })
            myConsole.log({ name })
            myConsole.log({ link })
            myConsole.log({ institution })
            myConsole.log({ summary })
            myConsole.log({ support })
            myConsole.log({ dataId })
            myConsole.log("-------------------------------------------------------------------------")
        } else if (/남성/.test(i.summary) && !/여성/.test(i.summary)) {
            desire = i.desire
            target = i.target
            obstacle = i.obstacle
            lifeCycle = i.lifeCycle
            name = i.name
            link = i.link
            institution = i.institution
            summary = i.summary
            support = i.support
            dataId = i.dataId
            myConsole.log({ gender: "남성" })
            myConsole.log({ desire })
            myConsole.log({ target })
            myConsole.log({ obstacle })
            myConsole.log({ lifeCycle })
            myConsole.log({ name })
            myConsole.log({ link })
            myConsole.log({ institution })
            myConsole.log({ summary })
            myConsole.log({ support })
            myConsole.log({ dataId })
            myConsole.log("-------------------------------------------------------------------------")
        } else {
            desire = i.desire
            target = i.target
            obstacle = i.obstacle
            lifeCycle = i.lifeCycle
            name = i.name
            link = i.link
            institution = i.institution
            summary = i.summary
            support = i.support
            dataId = i.dataId
            myConsole.log({ gender: "" })
            myConsole.log({ desire })
            myConsole.log({ target })
            myConsole.log({ obstacle })
            myConsole.log({ lifeCycle })
            myConsole.log({ name })
            myConsole.log({ link })
            myConsole.log({ institution })
            myConsole.log({ summary })
            myConsole.log({ support })
            myConsole.log({ dataId })
            myConsole.log("-------------------------------------------------------------------------")
        }
    }
}
gender()
