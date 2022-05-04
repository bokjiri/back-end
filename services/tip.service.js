const fs = require("fs")
exports.postTip = (userId, dataId) => {
    const data = "\nuserId: " + userId.toString() + " dataId: " + dataId.toString()

    fs.writeFile("./tip_log.txt", data, { flag: "a+" }, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}
