const { checkUserData, checkUserId, checkBokjiApi } = require("../services/main.service")

exports.getMain = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['Main']
    #swagger.summary = '추천 정책 카테고리별 조회'
    #swagger.description = '내 정보와 일치하는 정책 목록을 카테고리별로 모두 조회한다.'
    ========================================================================================================*/
    try {
        if (!req.params.userId) {
            /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userId가 params로 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", code: -10, message: "필수 입력값 조회 실패" }
        }
        =====================================================================================*/
            return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" })
        }
        const { userId } = req.params
        const isUser = await checkUserId(userId)
        if (!isUser) {
            /*=====================================================================================
        #swagger.responses[404] = {
            description: '입력 받은 userId가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
            return res.status(404).json({ result: "FAIL", code: -11, message: "데이터베이스 조회 실패" })
        }
        const allData = await checkBokjiApi()
        if (!allData) {
            /*=====================================================================================
        #swagger.responses[404] = {
            description: 'BokjiApi가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
            return res.status(404).json({ result: "FAIL", code: -11, message: "데이터베이스 조회 실패" })
        }
        const isData = allData
        //-----------------------------------------------------------추천 로직-----------------------------------------------------------------//
        let checkedWithLifeCycle = []
        //만약 isUser에 lifecycle이 존재한다면
        if (isUser.lifeCycle.length !== 0) {
            for (let i = 0; i < isUser.lifeCycle.length; i++) {
                for (let j = 0; j < isData.length; j++) {
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

        let checkedWithTarget = []
        //만약 isUser에 target이 존재한다면
        if (isUser.target.length !== 0) {
            for (let i = 0; i < isUser.target.length; i++) {
                for (let j = 0; j < checkedWithLifeCycle.length; j++) {
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
        let checkedWithObstacle = []
        if (isUser.obstacle.length !== 0) {
            for (let i = 0; i < isUser.obstacle.length; i++) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
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

        // let checkedData = await checkUserData(isUser, isData)   -> DB를 탄다면 사용
        let result = checkedWithObstacle.filter((v, i) => checkedWithObstacle.indexOf(v).name === i.name)
        let checkedData = result
        //----------------------------------------------------------------------------------------------------------------------------//
        let work = []
        let houseLife = []
        let health = []
        let eduCare = []
        let safetyRight = []
        let etc = []
        for (let i = 0; i < checkedData.length; i++) {
            if (checkedData[i].desire === "일자리") {
                work.push(checkedData[i])
            }
            if (checkedData[i].desire === "주거 및 일상생활") {
                houseLife.push(checkedData[i])
            }
            if (checkedData[i].desire === "건강") {
                health.push(checkedData[i])
            }
            if (checkedData[i].desire === "교육 및 돌봄") {
                eduCare.push(checkedData[i])
            }
            if (checkedData[i].desire === "안전 및 권익보장") {
                safetyRight.push(checkedData[i])
            }
            if (checkedData[i].desire === "기타") {
                etc.push(checkedData[i])
            }
        }
        //checkedData는 배열 안에 오브젝트(정책 하나)가 들어가있어야 한다.

        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", 
            message: "메인 페이지 추천 정책 조회 성공", 
            checkedData, 
            work,
            houseLife,
            health,
            eduCare,
            safetyRight,
            etc }
        }
        =====================================================================================*/
        return res.status(200).json({
            result: "SUCCESS",
            message: "메인 페이지 추천 정책 조회 성공",
            checkedData,
            work,
            houseLife,
            health,
            eduCare,
            safetyRight,
            etc,
        })
    } catch (error) {
        console.error(error)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "메인 페이지 추천 정책 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "FAIL",
            message: "메인 페이지 추천 정책 조회 실패",
        })
    }
}
