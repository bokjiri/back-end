require("dotenv").config()
const axios = require("axios")
const cheerio = require("cheerio")
const schedule = require("node-schedule")

// const getHTML = async (keyword) => {
//     try {
//         return await axios.get("https://search.naver.com/search.naver?where=news&sm=tab_jum&query= " + encodeURI(keyword))
//     } catch (err) {}
// }
// const parsing = async (keyword) => {
//     const html = await getHTML(keyword)
//     // console.log(html)
//     const $ = cheerio.load(html.data)
//     // console.log($)
//     const newsList = $(".news_wrap")
//     console.log(newsList)
// }

// const postHTMLList = async () => {
//     try {
//         return await axios.post("https://www.bokjiro.go.kr/ssis-teu/TWAT52005M/twataa/wlfareInfo/selectWlfareInfo.do", {
//             dmScr: { curScrId: "teu/app/twat/twata/twataa/TWAT52005M", befScrId: "" },
//             dmSearchParam: {
//                 age: "",
//                 bkjrLftmCycCd: "",
//                 daesang: "",
//                 endYn: "",
//                 favoriteKeyword: "Y",
//                 gungu: "",
//                 jjim: "",
//                 onlineYn: "",
//                 orderBy: "date",
//                 page: "1",
//                 period: "",
//                 region: "",
//                 searchTerm: "",
//                 sido: "",
//                 subject: "",
//                 tabId: "2",
//             },
//         })
//     } catch (error) {
//         console.error(error)
//     }
// }
// const parsing = async () => {
//     const html = await postHTMLList()
//     console.log(html)
//     console.log(html.data.dsServiceList2)
//     const $ = cheerio.load(html.data.dsServiceList2)
//     console.log($)
//     const newsList = $()
//     console.log(newsList)
// }

// parsing()
const getHTMLDetail = async () => {
    try {
        return await axios.get("https://www.bokjiro.go.kr/ssis-teu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=WLF00003791&wlfareInfoReldBztpCd=02")
    } catch (error) {
        console.error(error)
    }
}
const parsingGet = async () => {
    const html = await getHTMLDetail()
    // console.log(html.data)
    const $ = cheerio.load(html.data)
    // console.log($)
    // const data = $(
    //     "div.cl-control div.cl-layout div.cl-layout-content div.cl-layout-wrap div.cl-control div.cl-layout div.cl-layout-content div.cl-last-row div.cl-control div.cl-layout-content div.cl-first-row div.cl-control div.cl-layout div.cl-layout-content div.cl-first-row div.cl-control div.cl-layout div.cl-layout-content div.cl-first-row div.card div.cl-layout div.cl-layout-content div.cl-last-row div.cl-control div.cl-layout div.cl-layout-content div.cl-control div.cl-layout div.cl-layout-content div.cl-control div.cl-layout div.cl-layout-content div.cl-layout-wrap div.card-circle div.cl-layout div.cl-layout-content div.cl-last-row div.card-subtit div div.cl-text"
    // ).html()
    const data = $("html head")
    console.log(data.html())
    // let result = []
    // data.each((idx, node) => {
    //     result.push({
    //         idx,
    //         a: $(node).find("div .cl-text").text(),
    //     })
    //     console.log($(node).find("div .cl-text").text())
    // })
    // console.log(result)
}

parsingGet()

// #uuid-2e66940d-6275-6551-be1c-0e5c4edc14d0 > div > div > div
// #uuid-b93501c4-ff72-908c-8f64-5d65e30da19b > div > div > div > div:nth-child(2)
// #\35 7f897ec-e5e0-ab35-56e1-7a0ef2297e54 > div > div
//#\35 7f897ec-e5e0-ab35-56e1-7a0ef2297e54 > div
///html/body/div[1]/div[1]/div/div[3]/div/div/div/div[3]/div/div/div/div[2]/div/div/div/div[2]/div/div/div/div[2]/div/div/div/div[3]/div/div/div/div[5]/div/div/div[3]/div/div/div[1]/div/div/div/div[4]/div/div/div
// #\35 7f897ec-e5e0-ab35-56e1-7a0ef2297e54 > div > div
////*[@id="57f897ec-e5e0-ab35-56e1-7a0ef2297e54"]/div/div
// #e1346050-8643-3a51-4520-2ed608140ef1 > div > div
//<div class="cl-text" style="display:table-cell;height:100%;vertical-align:inherit;">전라북도 완주군</div>
//<div class="cl-text" style="display:table-cell;height:100%;vertical-align:inherit;">전라북도 완주군</div>
//document.querySelector("#\\35 7f897ec-e5e0-ab35-56e1-7a0ef2297e54 > div > div")
// #e1346050-8643-3a51-4520-2ed608140ef1 > div > div
