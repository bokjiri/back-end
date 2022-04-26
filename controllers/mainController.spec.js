describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
})

const { getMain } = require("./mainController")

describe("type test", () => {
    test("is function?", async () => {
        expect(typeof getMain).toBe("function")
    })
})
