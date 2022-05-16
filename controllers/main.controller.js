const { checkUser, checkData } = require("../services/main.service")

exports.getMain = async (req, res, next) => {
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
        const isUser = await checkUser(userId)
        if (!isUser) {
            /*=====================================================================================
        #swagger.responses[404] = {
            description: '입력 받은 userId가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
            return res.status(404).json({ result: "FAIL", code: -11, message: "데이터베이스 조회 실패" })
        }
        const isData = await checkData(isUser)
        if (!isData) {
            /*=====================================================================================
        #swagger.responses[404] = {
            description: 'data가 DB에 존재하지 않을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", code: -11, message: "데이터베이스 조회 실패" }
        }
        =====================================================================================*/
            return res.status(404).json({ result: "FAIL", code: -11, message: "데이터베이스 조회 실패" })
        }
        console.log(isUser)
        // 정책 추천 로직
        const checkedData = await this.logic(isUser, isData)
        if (!checkedData) {
            throw new Error()
        }
        // 카테고리 분류
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
        console.error("메인 페이지 추천 정책 조회 실패", error)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "메인 페이지 추천 정책 조회 실패" }
        }
        =====================================================================================*/
        // return res.status(400).json({
        //     result: "FAIL",
        //     message: "메인 페이지 추천 정책 조회 실패",
        // })
        return next({
            message: "메인 페이지 추천 정책 조회 실패",
            stack: error,
        })
    }
}

exports.logic = async (isUser, isData) => {
    try {
        //-----------------------------------------------------------age/lifeCycle 조건 검사-----------------------------------------------------------------//
        let checkedWithAge = []
        //만약 isUser에 age가 존재하지 않는다면
        if (!isUser.age || isUser.age < 0 || !isUser.lifeCycle[0]) {
            throw new Error()
        }
        //만약 isUser에 age가 존재한다면
        for (let j = 0; j < isData.length; j++) {
            //isData에 age 기준이 존재할 때
            if (isData[j].age.length === 2 && isData[j].age[0] <= isUser.age && isData[j].age[1] > isUser.age) {
                checkedWithAge.push(isData[j])
            }
            //isData에 lifeCycle 기준이 존재할 때
            else if (isUser.lifeCycle.length === 1) {
                if (isData[j].lifeCycle.includes(isUser.lifeCycle[0]) === true) {
                    checkedWithAge.push(isData[j])
                }
            }
            //isData에 age와 lifeCycle 기준이 존재하지 않을 때
            else if (isData[j].age.length === 0 && isData[j].lifeCycle.length === 0) {
                checkedWithAge.push(isData[j])
            }
        } // console.log(checkedWithAge)
        //-----------------------------------------------------------disability/obstacle 조건 검사-----------------------------------------------------------------//
        let checkedWithDisability = []
        //만약 isUser에 disability가 존재하지 않는다면
        if (!isUser.disability[0]) {
            throw new Error()
        }
        //만약 isUser에 disability가 '있음'으로 존재한다면
        if (isUser.disability[0] === "있음") {
            for (let j = 0; j < checkedWithAge.length; j++) {
                //장애 여부 상관 없는 정책
                if (checkedWithAge[j].target[0] === undefined) {
                    checkedWithDisability.push(checkedWithAge[j])
                }
                //장애인 대상 정책
                else if (checkedWithAge[j].target.includes("장애인") === true) {
                    for (let i = 0; i < isUser.obstacle.length; i++) {
                        if (checkedWithAge[j].obstacle.includes(isUser.obstacle[i]) === true || checkedWithAge[j].obstacle[0] === undefined) {
                            checkedWithDisability.push(checkedWithAge[j])
                        }
                    }
                }
            }
        }
        //만약 isUser에 disability이 '없음'으로 존재한다면
        else if (isUser.disability[0] === "없음") {
            for (let j = 0; j < checkedWithAge.length; j++) {
                if (checkedWithAge[j].target.includes("장애인") === false) {
                    checkedWithDisability.push(checkedWithAge[j])
                }
            }
        } // console.log(checkedWithDisability)
        //-----------------------------------------------------------gender 조건 검사-----------------------------------------------------------------//
        let checkedWithGender = []
        //만약 isUser에 gender 조건이 존재하지 않는다면
        if (!isUser.gender[0]) {
            for (let j = 0; j < checkedWithDisability.length; j++) {
                if (!checkedWithDisability[j].gender) {
                    checkedWithGender.push(checkedWithDisability[j])
                }
            }
        }
        //만약 isUser에 gender 조건이 '여성'으로 존재한다면
        else if (isUser.gender[0] === "여성") {
            for (let j = 0; j < checkedWithDisability.length; j++) {
                if (checkedWithDisability[j].gender === isUser.gender[0] || !checkedWithDisability[j].gender) {
                    checkedWithGender.push(checkedWithDisability[j])
                }
            }
        }
        //만약 isUser에 gender 조건이 '남성'으로 존재한다면
        else if (isUser.gender[0] === "남성") {
            for (let j = 0; j < checkedWithDisability.length; j++) {
                if (checkedWithDisability[j].gender === isUser.gender[0] || !checkedWithDisability[j].gender) {
                    checkedWithGender.push(checkedWithDisability[j])
                }
            }
        } // console.log(checkedWithGender)
        //-----------------------------------------------------------region 조건 검사-----------------------------------------------------------------//
        let checkedWithRegion = []
        //만약 isUser에 region 조건이 존재하지 않는다면
        if (!isUser.region[0]) {
            for (let j = 0; j < checkedWithGender.length; j++) {
                if (checkedWithGender[j].region[0] === undefined) {
                    checkedWithRegion.push(checkedWithGender[j])
                }
            }
        }
        //만약 isUser에 region 조건이 하나만 존재한다면
        else if (isUser.region.length === 1) {
            for (let j = 0; j < checkedWithGender.length; j++) {
                if (checkedWithGender[j].region.includes(isUser.region[0]) === true || checkedWithGender[j].region[0] === undefined) {
                    checkedWithRegion.push(checkedWithGender[j])
                }
            }
        }
        //만약 isUser에 region 조건이 모두 존재한다면
        else if (isUser.region.length === 2) {
            for (let j = 0; j < checkedWithGender.length; j++) {
                //지역 무관 정책
                if (checkedWithGender[j].region[0] === undefined) {
                    checkedWithRegion.push(checkedWithGender[j])
                }
                //지역 맞춤 정책
                else if (checkedWithGender[j].region[0] === isUser.region[0] && checkedWithGender[j].region.includes(isUser.region[1]) === true) {
                    checkedWithRegion.push(checkedWithGender[j])
                }
            }
        } // console.log(checkedWithRegion)
        //-----------------------------------------------------------scholarship 조건 검사-----------------------------------------------------------------//
        let checkedWithScholarship = []
        //만약 isUser에 scholarship 조건이 존재하지 않는다면
        if (!isUser.scholarship[0]) {
            for (let j = 0; j < checkedWithRegion.length; j++) {
                if (checkedWithRegion[j].scholarship[0] === undefined) {
                    checkedWithScholarship.push(checkedWithRegion[j])
                }
            }
        }
        //만약 isUser에 scholarship 조건이 존재한다면
        else {
            for (let j = 0; j < checkedWithRegion.length; j++) {
                if (checkedWithRegion[j].scholarship.includes(isUser.scholarship[0]) === true || checkedWithRegion[j].scholarship[0] === undefined) {
                    checkedWithScholarship.push(checkedWithRegion[j])
                }
            }
        } // console.log(checkedWithScholarship)
        //-----------------------------------------------------------job 조건 검사-----------------------------------------------------------------//
        let checkedWithJob = []
        //만약 isUser에 job 조건이 존재하지 않는다면
        if (!isUser.job[0]) {
            for (let j = 0; j < checkedWithScholarship.length; j++) {
                if (!checkedWithScholarship[j].job) {
                    checkedWithJob.push(checkedWithScholarship[j])
                }
            }
        }
        //만약 isUser에 job 조건이 "취업"으로 존재한다면
        else if (isUser.job[0] === "취업") {
            for (let j = 0; j < checkedWithScholarship.length; j++) {
                if (!checkedWithScholarship[j].job) {
                    checkedWithJob.push(checkedWithScholarship[j])
                }
            }
        }
        //만약 isUser에 job 조건이 "미취업"으로 존재한다면
        else if (isUser.job[0] === "미취업") {
            for (let j = 0; j < checkedWithScholarship.length; j++) {
                if (checkedWithScholarship[j].job === isUser.job[0] || !checkedWithScholarship[j].job) {
                    checkedWithJob.push(checkedWithScholarship[j])
                }
            }
        } // console.log(checkedWithJob)
        //-----------------------------------------------------------marriage 조건 검사-----------------------------------------------------------------//
        let checkedWithMarriage = []
        //만약 isUser에 marriage 조건이 존재하지 않는다면
        if (!isUser.marriage[0]) {
            for (let j = 0; j < checkedWithJob.length; j++) {
                if (checkedWithJob[j].marriage[0] === undefined) {
                    checkedWithMarriage.push(checkedWithJob[j])
                }
            }
        }
        //만약 isUser에 marriage 조건이 존재한다면
        else {
            for (let j = 0; j < checkedWithJob.length; j++) {
                if (checkedWithJob[j].marriage.includes(isUser.marriage[0]) === true || checkedWithJob[j].marriage[0] === undefined) {
                    checkedWithMarriage.push(checkedWithJob[j])
                }
            }
        } // console.log(checkedWithMarriage)
        //-----------------------------------------------------------target 조건 검사-----------------------------------------------------------------//
        let checkedWithTarget = []
        //만약 isUser에 target 조건이 존재하지 않는다면
        if (!isUser.target[0]) {
            for (let j = 0; j < checkedWithMarriage.length; j++) {
                if (checkedWithMarriage[j].target[0] === undefined) {
                    checkedWithTarget.push(checkedWithMarriage[j])
                }
            }
        }
        //만약 isUser에 target 조건이 존재한다면
        else {
            for (let j = 0; j < checkedWithMarriage.length; j++) {
                for (let i = 0; i < isUser.target.length; i++) {
                    if (checkedWithMarriage[j].target.includes(isUser.target[i]) === true || checkedWithMarriage[j].target[0] === undefined) {
                        checkedWithTarget.push(checkedWithMarriage[j])
                    }
                }
            }
        } // console.log(checkedWithTarget)
        //-----------------------------------------------------------salary/family 조건 검사-----------------------------------------------------------------//
        let checkedWithSalary = []
        //만약 isUser에 salary와 family 조건이 존재하지 않는다면
        if (!isUser.salary || !isUser.family) {
            for (let j = 0; j < checkedWithTarget.length; j++) {
                if (checkedWithTarget[j].target.includes("저소득") === false) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            }
        }
        //만약 isUser에 salary와 family 조건이 존재한다면
        else if (isUser.salary && isUser.family) {
            //기준 중위 소득 60% 미만인 경우 저소득 정책 추가
            if (isUser.family === 1 && isUser.salary <= 116) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            } else if (isUser.family === 2 && isUser.salary <= 195) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            } else if (isUser.family === 3 && isUser.salary <= 251) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            } else if (isUser.family === 4 && isUser.salary <= 307) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            } else if (isUser.family === 5 && isUser.salary <= 361) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            } else if (isUser.family === 6 && isUser.salary <= 414) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            } else if (isUser.family === 7 && isUser.salary <= 466) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            } else if (isUser.family === 8 && isUser.salary <= 519) {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    checkedWithSalary.push(checkedWithTarget[j])
                }
            }
            //기준 중위 소득 60% 이상인 경우 저소득 정책 제외
            else {
                for (let j = 0; j < checkedWithTarget.length; j++) {
                    if (checkedWithTarget[j].target.includes("저소득") === false) {
                        checkedWithSalary.push(checkedWithTarget[j])
                    }
                }
            }
        } //
        // console.log(checkedWithSalary)
        //-----------------------------------------------------------중복 제거-----------------------------------------------------------------//
        let checkedData = checkedWithSalary.filter((v, i) => {
            return (
                checkedWithSalary.findIndex((v2, j) => {
                    return v.name === v2.name
                }) === i
            )
        })
        //----------------------------------------------------------------------------------------------------------------------------//
        return checkedData
    } catch (error) {
        console.error("정책 추천 실패", error)
    }
}
