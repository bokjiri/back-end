const User = require("../schemas/user")
const BokjiApi = require("../schemas/data")

exports.checkUserData = async (userId) => {
    try {
        // checkedData = []
        const [userData] = await User.find({ userId }, { _id: false, lifeCycle: true, target: true, obstacle: true })

        checkedWithLifeCycle = []
        //만약 userData에 lifecycle이 존재한다면
        if (userData.lifeCycle.length !== 0) {
            for (let i = 0; i < userData.lifeCycle.length; i++) {
                checkedWithLifeCycle.push(await BokjiApi.find({ lifeCycle: userData.lifeCycle[i] }))
            }
        }
        //만약 userData에 lifecycle이 존재하지 않는다면
        else {
            checkedWithLifeCycle.push(await BokjiApi.find({}))
        } // console.log(checkedWithLifeCycle)

        checkedWithTarget = []
        //만약 userData에 target이 존재한다면
        if (userData.target.length !== 0) {
            for (let i = 0; i < userData.target.length; i++) {
                checkedWithLifeCycle[0].forEach((data) => {
                    if (data.target.includes(userData.target[i]) === true) {
                        checkedWithTarget.push(data)
                    }
                })
            }
        }
        //만약 userData에 target이 존재하지 않는다면
        else {
            checkedWithTarget = checkedWithLifeCycle
        } // console.log(checkedWithTarget)

        //만약 userData에 obstacle이 존재한다면
        checkedWithObstacle = []
        if (userData.obstacle.length !== 0) {
            for (let i = 0; i < userData.obstacle.length; i++) {
                checkedWithTarget.forEach((data) => {
                    if (data.obstacle.includes(userData.obstacle[i]) === true) {
                        checkedWithObstacle.push(data)
                    }
                })
            }
        }
        //만약 userData에 obstacle이 존재하지 않는다면
        else {
            checkedWithObstacle = checkedWithTarget
        }
        console.log(checkedWithObstacle)

        return checkedWithObstacle
    } catch (error) {
        console.log(error)
    }
}
