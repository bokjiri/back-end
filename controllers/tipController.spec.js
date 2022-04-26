describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
})

const {
    getTips,
    postTips,
    getDetailTips,
    putDetailTips,
    deleteDetailTips,
} = require("./tipController")

describe("type test", () => {
    test("is function?", async () => {
        expect(typeof getTips).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof postTips).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof getDetailTips).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof putDetailTips).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof deleteDetailTips).toBe("function")
    })
})
