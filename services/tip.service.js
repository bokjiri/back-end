const fs = require("fs")
exports.postTip = (userId, dataId) => {
    if (!userId || !dataId) throw new Error()
    const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]
    const time = new Date().toTimeString().split(" ")[0]
    const data = "\nuserId: " + userId.toString() + " dataId: " + dataId.toString() + " ||" + " Date: " + date + " Time: " + time

    fs.writeFile("./tip_log.txt", data, { flag: "a+" }, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
}
