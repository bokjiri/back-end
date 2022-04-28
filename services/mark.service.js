const User = require("../schemas/user")

exports.showMark = (userId) => {
    try {
        User.findOne({ userId }).exec()
    } catch (err) {}
}
