const mongoose = require("mongoose")

const connect = () => {
    mongoose.connect(`mongodb://${process.env.DBID}:${process.env.DBPW}@3.36.130.225:27017/dev?authSource=admin&authMechanism=SCRAM-SHA-1`, { ignoreUndefined: true }).catch((err) => {
        console.error(err)
    })
}

module.exports = connect
