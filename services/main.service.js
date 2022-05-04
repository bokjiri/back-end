const User = require("../schemas/user")
const BokjiApi = require("../schemas/data")

exports.checkUserId = async (userId) => {
    try {
        const [userData] = await User.find({ userId }, { _id: false, lifeCycle: true, target: true, obstacle: true })
        // console.log(userData)
        return userData
    } catch (err) {}
}

exports.checkBokjiApi = () => {
    try {
        return BokjiApi.find({})
    } catch (err) {}
}

exports.checkUserData = async (isUser, isData) => {
    // console.log(isUser)
    // console.log(isData)
    try {
        // checkedData = []
        checkedWithLifeCycle = []
        //만약 isUser에 lifecycle이 존재한다면
        if (isUser.lifeCycle.length !== 0) {
            for (let i = 0; i < isUser.lifeCycle.length; i++) {
                isData.forEach((data) => {
                    if (data.lifeCycle.includes(isUser.lifeCycle[i]) === true || data.lifeCycle[0] === undefined) {
                        checkedWithLifeCycle.push(data)
                    }
                })
            }
        }
        //만약 isUser에 lifecycle이 존재하지 않는다면
        else {
            checkedWithLifeCycle = isData
        } // console.log(checkedWithLifeCycle)

        checkedWithTarget = []
        //만약 isUser에 target이 존재한다면
        if (isUser.target.length !== 0) {
            for (let i = 0; i < isUser.target.length; i++) {
                checkedWithLifeCycle.forEach((data) => {
                    if (data.target.includes(isUser.target[i]) === true || data.target[0] === undefined) {
                        checkedWithTarget.push(data)
                    }
                })
            }
        }
        //만약 isUser에 target이 존재하지 않는다면
        else {
            checkedWithTarget = checkedWithLifeCycle
        } // console.log(checkedWithTarget)

        //만약 isUser에 obstacle이 존재한다면
        checkedWithObstacle = []
        if (isUser.obstacle.length !== 0) {
            for (let i = 0; i < isUser.obstacle.length; i++) {
                checkedWithTarget.forEach((data) => {
                    if (data.obstacle.includes(isUser.obstacle[i]) === true || data.obstacle[0] === undefined) {
                        checkedWithObstacle.push(data)
                    }
                })
            }
        }
        //만약 isUser에 obstacle이 존재하지 않는다면
        else {
            checkedWithObstacle = checkedWithTarget
        } // console.log(checkedWithObstacle)

        return checkedWithObstacle
    } catch (err) {}
}
