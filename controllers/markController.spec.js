describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
})

const { getMarks, postMarks, deleteMarks } = require("./markController")

describe("type test", () => {
    test("is function?", async () => {
        expect(typeof getMarks).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof postMarks).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof deleteMarks).toBe("function")
    })
})
