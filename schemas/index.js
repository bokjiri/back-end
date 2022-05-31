const mongoose = require("mongoose")
const MONGOURI = process.env.MONGOURI
module.exports = () => {
    if (process.env.NODE_ENV !== "test") {
        mongoose
            .connect(MONGOURI, { ignoreUndefined: true })
            .then(() => {
                console.log("mongodb 연결완료")
            })
            .catch((error) => {
                console.error(error)
            })
    }
}
