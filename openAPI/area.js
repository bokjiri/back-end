const regionCode = [
    "003002001001",
    "003002001002",
    "003002001003",
    "003002001004",
    "003002001005",
    "003002001006",
    "003002001007",
    "003002001008",
    "003002001009",
    "003002001010",
    "003002001011",
    "003002001012",
    "003002001013",
    "003002001014",
    "003002001015",
    "003002001016",
    "003002001017",
    "003002001018",
    "003002001019",
    "003002001020",
    "003002001021",
    "003002001022",
    "003002001023",
    "003002001024",
    "003002001025",
    "003002002001",
    "003002002002",
    "003002002003",
    "003002002004",
    "003002002005",
    "003002002006",
    "003002002007",
    "003002002008",
    "003002002009",
    "003002002010",
    "003002002011",
    "003002002012",
    "003002002013",
    "003002002014",
    "003002002015",
    "003002002016",
    "003002003001",
    "003002003002",
    "003002003003",
    "003002003004",
    "003002003005",
    "003002003006",
    "003002003007",
    "003002003008",
    "003002004001",
    "003002004002",
    "003002004003",
    "003002004004",
    "003002004005",
    "003002004006",
    "003002004007",
    "003002004008",
    "003002004009",
    "003002004010",
    "003002004011",
    "003002005001",
    "003002005002",
    "003002005003",
    "003002005004",
    "003002005005",
    "003002006001",
    "003002006002",
    "003002006003",
    "003002006004",
    "003002006005",
    "003002007001",
    "003002007002",
    "003002007003",
    "003002007004",
    "003002007005",
    "003002008001",
    "003002008002",
    "003002008003",
    "003002008004",
    "003002008005",
    "003002008006",
    "003002008007",
    "003002008008",
    "003002008009",
    "003002008010",
    "003002008011",
    "003002008012",
    "003002008013",
    "003002008014",
    "003002008015",
    "003002008016",
    "003002008017",
    "003002008018",
    "003002008019",
    "003002008020",
    "003002008021",
    "003002008022",
    "003002008023",
    "003002008024",
    "003002008025",
    "003002008026",
    "003002008027",
    "003002008028",
    "003002008029",
    "003002008030",
    "003002008031",
    "003002008032",
    "003002008033",
    "003002008034",
    "003002009001",
    "003002009002",
    "003002009003",
    "003002009004",
    "003002009005",
    "003002009006",
    "003002009007",
    "003002009008",
    "003002009009",
    "003002009010",
    "003002009011",
    "003002009012",
    "003002009013",
    "003002009014",
    "003002009015",
    "003002009016",
    "003002009017",
    "003002009018",
    "003002010001",
    "003002010002",
    "003002010003",
    "003002010004",
    "003002010005",
    "003002010006",
    "003002010007",
    "003002010008",
    "003002010009",
    "003002010010",
    "003002010011",
    "003002010012",
    "003002011001",
    "003002011002",
    "003002011003",
    "003002011004",
    "003002011005",
    "003002011006",
    "003002011007",
    "003002011008",
    "003002011009",
    "003002011010",
    "003002011011",
    "003002011012",
    "003002011013",
    "003002011014",
    "003002011015",
    "003002011016",
    "003002011017",
    "003002012001",
    "003002012002",
    "003002012003",
    "003002012004",
    "003002012005",
    "003002012006",
    "003002012007",
    "003002012008",
    "003002012009",
    "003002012010",
    "003002012011",
    "003002012012",
    "003002012013",
    "003002012014",
    "003002013001",
    "003002013002",
    "003002013003",
    "003002013004",
    "003002013005",
    "003002013006",
    "003002013007",
    "003002013008",
    "003002013009",
    "003002013010",
    "003002013011",
    "003002013012",
    "003002013013",
    "003002013014",
    "003002013015",
    "003002013016",
    "003002013017",
    "003002013018",
    "003002013019",
    "003002013020",
    "003002013021",
    "003002013022",
    "003002014001",
    "003002014002",
    "003002014003",
    "003002014004",
    "003002014005",
    "003002014006",
    "003002014007",
    "003002014008",
    "003002014009",
    "003002014010",
    "003002014011",
    "003002014012",
    "003002014013",
    "003002014014",
    "003002014015",
    "003002014016",
    "003002014017",
    "003002014018",
    "003002014019",
    "003002014020",
    "003002014021",
    "003002014022",
    "003002014023",
    "003002015001",
    "003002015002",
    "003002015003",
    "003002015004",
    "003002015005",
    "003002015006",
    "003002015007",
    "003002015008",
    "003002015009",
    "003002015010",
    "003002015011",
    "003002015012",
    "003002015013",
    "003002015014",
    "003002015015",
    "003002015016",
    "003002015017",
    "003002015018",
    "003002015019",
    "003002015020",
    "003002016001",
    "003002016002",
    "003002016003",
    "003002016004",
    "003002017001",
]
const regionName = [
    ["서울", "종로구"],
    ["서울", "중구"],
    ["서울", "용산구"],
    ["서울", "성동구"],
    ["서울", "광진구"],
    ["서울", "동대문구"],
    ["서울", "중랑구"],
    ["서울", "성북구"],
    ["서울", "강북구"],
    ["서울", "도봉구"],
    ["서울", "노원구"],
    ["서울", "은평구"],
    ["서울", "서대문구"],
    ["서울", "마포구"],
    ["서울", "양천구"],
    ["서울", "강서구"],
    ["서울", "구로구"],
    ["서울", "금천구"],
    ["서울", "영등포구"],
    ["서울", "동작구"],
    ["서울", "관악구"],
    ["서울", "서초구"],
    ["서울", "강남구"],
    ["서울", "송파구"],
    ["서울", "강동구"],
    ["부산", "중구"],
    ["부산", "서구"],
    ["부산", "동구"],
    ["부산", "영도구"],
    ["부산", "부산진구"],
    ["부산", "동래구]"],
    ["부산", "남구"],
    ["부산", "북구"],
    ["부산", "해운대구"],
    ["부산", "사하구"],
    ["부산", "금정구"],
    ["부산", "강서구"],
    ["부산", "연제구"],
    ["부산", "수영구"],
    ["부산", "사상구"],
    ["부산", "기장군"],
    ["대구", "중구"],
    ["대구", "동구"],
    ["대구", "서구"],
    ["대구", "남구"],
    ["대구", "북구"],
    ["대구", "수성구"],
    ["대구", "달서구"],
    ["대구", "달성군"],
    ["인천", "중구"],
    ["인천", "동구"],
    ["인천", "남구"],
    ["인천", "미추홀구"],
    ["인천", "연수구"],
    ["인천", "남동구"],
    ["인천", "부평구"],
    ["인천", "계양구"],
    ["인천", "서구"],
    ["인천", "강화군"],
    ["인천", "옹진군"],
    ["광주", "동구"],
    ["광주", "서구"],
    ["광주", "남구"],
    ["광주", "북구"],
    ["광주", "광산"],
    ["대전", "동구"],
    ["대전", "중구"],
    ["대전", "서구"],
    ["대전", "유성구"],
    ["대전", "대덕구"],
    ["울산", "중구"],
    ["울산", "남구"],
    ["울산", "동구"],
    ["울산", "북구"],
    ["울산", "울주군"],
    ["경기", "수원시"],
    ["경기", "성남시"],
    ["경기", "의정부시"],
    ["경기", "안양시"],
    ["경기", "부천시"],
    ["경기", "광명시"],
    ["경기", "평택시"],
    ["경기", "동두천시"],
    ["경기", "안산시"],
    ["경기", "고양시"],
    ["경기", "과천시"],
    ["경기", "구리시"],
    ["경기", "남양주시"],
    ["경기", "오산시"],
    ["경기", "시흥시"],
    ["경기", "군포시"],
    ["경기", "의왕시"],
    ["경기", "하남시"],
    ["경기", "용인시"],
    ["경기", "파주시"],
    ["경기", "이천시"],
    ["경기", "안성시"],
    ["경기", "김포시"],
    ["경기", "화성시"],
    ["경기", "광주시"],
    ["경기", "양주시"],
    ["경기", "포천시"],
    ["경기", "여주시"],
    ["경기", "양주군"],
    ["경기", "여주군"],
    ["경기", "연천군"],
    ["경기", "포천군"],
    ["경기", "가평군"],
    ["경기", "양평군"],
    ["강원", "춘천시"],
    ["강원", "원주시"],
    ["강원", "강릉시"],
    ["강원", "동해시"],
    ["강원", "태백시"],
    ["강원", "속초시"],
    ["강원", "삼척시"],
    ["강원", "홍천군"],
    ["강원", "횡성군"],
    ["강원", "영월군"],
    ["강원", "평창군"],
    ["강원", "정선군"],
    ["강원", "철원군"],
    ["강원", "화천군"],
    ["강원", "양구군"],
    ["강원", "인제군"],
    ["강원", "고성군"],
    ["강원", "양양군"],
    ["충북", "청주시"],
    ["충북", "충주시"],
    ["충북", "제천시"],
    ["충북", "청원군"],
    ["충북", "보은군"],
    ["충북", "옥천군"],
    ["충북", "영동군"],
    ["충북", "증평군"],
    ["충북", "진천군"],
    ["충북", "괴산군"],
    ["충북", "음성군"],
    ["충북", "단양군"],
    ["충남", "천안시"],
    ["충남", "공주시"],
    ["충남", "보령시"],
    ["충남", "아산시"],
    ["충남", "서산시"],
    ["충남", "논산시"],
    ["충남", "계룡시"],
    ["충남", "당진시"],
    ["충남", "금산군"],
    ["충남", "연기군"],
    ["충남", "부여군"],
    ["충남", "서천군"],
    ["충남", "청양군"],
    ["충남", "홍성군"],
    ["충남", "예산군"],
    ["충남", "태안군"],
    ["충남", "당진군"],
    ["전북", "전주시"],
    ["전북", "군산시"],
    ["전북", "익산시"],
    ["전북", "정읍시"],
    ["전북", "남원시"],
    ["전북", "김제시"],
    ["전북", "완주군"],
    ["전북", "진안군"],
    ["전북", "무주군"],
    ["전북", "장수군"],
    ["전북", "임실군"],
    ["전북", "순창군"],
    ["전북", "고창군"],
    ["전북", "부안군"],
    ["전남", "목포시"],
    ["전남", "여수시"],
    ["전남", "순천시"],
    ["전남", "나주시"],
    ["전남", "광양시"],
    ["전남", "담양군"],
    ["전남", "곡성군"],
    ["전남", "구례군"],
    ["전남", "고흥군"],
    ["전남", "보성군"],
    ["전남", "화순군"],
    ["전남", "장흥군"],
    ["전남", "강진군"],
    ["전남", "해남군"],
    ["전남", "영암군"],
    ["전남", "무안군"],
    ["전남", "함평군"],
    ["전남", "영광군"],
    ["전남", "장성군"],
    ["전남", "완도군"],
    ["전남", "진도군"],
    ["전남", "신안군"],
    ["경북", "포항시"],
    ["경북", "경주시"],
    ["경북", "김천시"],
    ["경북", "안동시"],
    ["경북", "구미시"],
    ["경북", "영주시"],
    ["경북", "영천시"],
    ["경북", "상주시"],
    ["경북", "문경시"],
    ["경북", "경산시"],
    ["경북", "군위군"],
    ["경북", "의성군"],
    ["경북", "청송군"],
    ["경북", "영양군"],
    ["경북", "영덕군"],
    ["경북", "청도군"],
    ["경북", "고령군"],
    ["경북", "성주군"],
    ["경북", "칠곡군"],
    ["경북", "예천군"],
    ["경북", "봉화군"],
    ["경북", "울진군"],
    ["경북", "울릉군"],
    ["경남", "창원시"],
    ["경남", "마산시"],
    ["경남", "진주시"],
    ["경남", "진해시"],
    ["경남", "통영시"],
    ["경남", "사천시"],
    ["경남", "김해시"],
    ["경남", "밀양시"],
    ["경남", "거제시"],
    ["경남", "양산시"],
    ["경남", "의령군"],
    ["경남", "함안군"],
    ["경남", "창녕군"],
    ["경남", "고성군"],
    ["경남", "남해군"],
    ["경남", "하동군"],
    ["경남", "산청군"],
    ["경남", "함양군"],
    ["경남", "거창군"],
    ["경남", "합천군"],
    ["제주", "제주시"],
    ["제주", "서귀포시"],
    ["제주", "북제주군"],
    ["제주", "남제주군"],
    ["세종", "세종"],
]

module.exports = { regionCode, regionName }
