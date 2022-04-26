describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
    test("테스트 성공하는 상황", async () => {
        expect(await getKakao()).toEqual(false)
    })
    // test("테스트 실패하는 상황", async () => {
    //     expect(await getKakao()).toEqual(true)
    // })
})

const { getKakao } = require("./authController")

describe("type test", () => {
    test("is function?", async () => {
        expect(typeof getKakao).toBe("function")
    })
})
