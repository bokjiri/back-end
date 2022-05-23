const Data = require("../../../schemas/data")
const User = require("../../../schemas/user")

exports.findData = async (dataId) => {
    try {
        detailData = await Data.findOne({ dataId }, { _id: false, __v: false })
        const newSummary = `${detailData.summary}`
            //     .replace(
            //         /\n/gs,
            //         `
            // `
            //     )
            .replace(
                /(\.\s)/gs,
                `.
        `
            )
        // const newSummary = await this.replaceBrTag(`${detailData.summary}`)

        const newSupport = `${detailData.support}`
            //     .replace(
            //         /\n/gs,
            //         `
            // `
            //     )
            .replace(
                /(\.\s)/gs,
                `.
        `
            )
        // const newSupport = await this.replaceBrTag(`${detailData.support}`)

        const newCriteria = `${detailData.criteria}`
            //     .replace(
            //         /\n/gs,
            //         `
            // `
            //     )
            .replace(
                /(\.\s)/gs,
                `.
        `
            )
        // const newCriteria = await this.replaceBrTag(`${detailData.criteria}`)

        detailData.summary = newSummary
        detailData.support = newSupport
        detailData.criteria = newCriteria

        return detailData
    } catch (error) {
        console.error(error)
        return error
    }
}

exports.checkBookmark = async (userId) => {
    try {
        return await User.findOne({ userId }, { _id: false, mark: true })
    } catch (error) {
        console.error(error)
        return error
    }
}

exports.replaceBrTag = async (str) => {
    try {
        if (!str) {
            return ""
        }
        str = str.replace(/(\.\s)/g, ". \n")
        str = str.replace(/\n/gs, "<br>")

        return str
    } catch (error) {
        console.error(error)
        return error
    }
}
