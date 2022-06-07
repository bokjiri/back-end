const Data = require("../../../schemas/data")
const User = require("../../../schemas/user")

exports.findData = async (dataId) => {
    try {
        detailData = await Data.findOne({ dataId }, { _id: false, __v: false })
        const newSummary = `${detailData.summary}`
            .replace(/([^\d\.\s]\.\s)/gs, `. \n`)
            .replace(/(\n \n)/gs, `\n\n`)
            .replace(/(\n){2,}/gs, `\n\n`)
            .replace(/니./g, `니다.`)
        // const newSummary = await this.replaceBrTag(`${detailData.summary}`)

        const newSupport = `${detailData.support}`
            .replace(/([^\d\.\s]\.\s)/gs, `. \n`)
            .replace(/(\n \n)/gs, `\n\n`)
            .replace(/(\n){2,}/gs, `\n\n`)
            .replace(/니./g, `니다.`)
        // const newSupport = await this.replaceBrTag(`${detailData.support}`)

        const newCriteria = `${detailData.criteria}`
            .replace(/([^\d\.\s]\.\s)/gs, `. \n`)
            .replace(/(\n \n)/gs, `\n\n`)
            .replace(/(\n){2,}/gs, `\n\n`)
            .replace(/니./g, `니다.`)
        // const newCriteria = await this.replaceBrTag(`${detailData.criteria}`)

        detailData.summary = newSummary
        detailData.support = newSupport
        detailData.criteria = newCriteria

        return detailData
    } catch (error) {
        throw error
    }
}

exports.checkBookmark = async (userId) => {
    try {
        return await User.findOne({ userId }, { _id: false, mark: true })
    } catch (error) {
        throw error
    }
}

// exports.replaceBrTag = async (str) => {
//     try {
//         if (!str) {
//             return ""
//         }
//         str = str.replace(/(\.\s)/g, ". \n")
//         str = str.replace(/\n/gs, "<br>")

//         return str
//     } catch (error) {
//         console.error(error)
//         return error
//     }
// }
