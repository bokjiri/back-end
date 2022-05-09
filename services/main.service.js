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
                for (let j = 0; j < isData.length; j++){
                    if (isData[j].lifeCycle.includes(isUser.lifeCycle[i]) === true || isData[j].lifeCycle[0] === undefined) {
                        checkedWithLifeCycle.push(isData[j])
                    }
                }
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
                for (let j = 0; j < checkedWithLifeCycle.length; j++){
                    if (checkedWithLifeCycle[j].target.includes(isUser.target[i]) === true || checkedWithLifeCycle[j].target[0] === undefined) {
                        checkedWithTarget.push(checkedWithLifeCycle[j])
                    }
                }
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
                for (let j = 0; j < checkedWithTarget.length; j++){
                    if (checkedWithTarget[j].obstacle.includes(isUser.target[i]) === true || checkedWithTarget[j].obstacle[0] === undefined) {
                        checkedWithObstacle.push(checkedWithTarget[j])
                    }
                }
            }
        }
        //만약 isUser에 obstacle이 존재하지 않는다면
        else {
            checkedWithObstacle = checkedWithTarget
        } // console.log(checkedWithObstacle)

        return checkedWithObstacle
    } catch (err) {}
}
