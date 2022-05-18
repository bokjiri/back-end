const mongoose = require("mongoose")

module.exports = () => {
    if (process.env.NODE_ENV !== "test") {
        mongoose
            .connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/dev?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true })
            .then(() => {
                console.log("mongodb 연결완료")
            })
            .catch((error) => {
                console.error(error)
            })
    }
}
