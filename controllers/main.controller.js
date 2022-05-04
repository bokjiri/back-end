const e = require("express")
const { checkUserData, checkUserId, checkBokjiApi } = require("../services/main.service")

exports.getMain = async (req, res) => {
    /*========================================================================================================
    #swagger.tags = ['main']
    #swagger.summary = '정책 추천 API'
    #swagger.description = '내 정보와 일치하는 정책 목록을 조회하는 API'
    ========================================================================================================*/
    if (!req.params.userId) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'userId가 params로 입력되지 않았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -10, 'message': "필수 입력값 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "Fail", code: -10, message: "필수 입력값 조회 실패" })
    }
    const { userId } = req.params
    const isUser = await checkUserId(userId)
    if (!isUser) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '입력 받은 userId가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -11, 'message': "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "FAIL", code: -11, message: "데이터베이스 조회 실패" })
    }
    const allData = await checkBokjiApi()
    if (!allData) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: 'BokjiApi가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { "result": "FAIL", 'code': -11, 'message': "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({ result: "FAIL", code: -11, message: "데이터베이스 조회 실패" })
    }
    let isData = []
    allData.forEach((data)=>{
        if(data.lifeCycle[0] !== undefined || data.target[0] !== undefined || data.obstacle[0] !== undefined ){
            isData.push(data)
        } 
    })
    try {
        let checkedData = await checkUserData(isUser, isData)
        let work = []
        let houseLife = []
        let health = []
        let eduCare = []
        let safetyRight = []
        let etc = []
        checkedData.forEach((data)=>{
            if(data.desire === "일자리"){
                work.push(data)
            }
            if(data.desire === "주거 및 일상생활"){
                houseLife.push(data)
            }
            if(data.desire === "건강"){
                health.push(data)
            }
            if(data.desire === "교육 및 돌봄"){
                eduCare.push(data)
            }
            if(data.desire === "안전 및 권익보장"){
                safetyRight.push(data)
            }
            if(data.desire === "기타"){
                etc.push(data)
            }
        })
        //checkedData는 배열 안에 오브젝트(정책 하나)가 들어가있어야 한다.
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "메인 페이지 추천 정책 조회 성공", checkedData }
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
            etc
        })
    } catch (error) {
        console.log(error)
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "SUCCESS", message: "메인 페이지 추천 정책 조회 실패" }
        }
        =====================================================================================*/
        return res.status(400).json({
            result: "FAIL",
            message: "메인 페이지 추천 정책 조회 실패",
        })
    }
}
