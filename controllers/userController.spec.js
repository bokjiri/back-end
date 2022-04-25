describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
})

const {
    getUsers,
    postUsers,
    putUsers,
    deleteUsers,
} = require("./userController")

describe("type test", () => {
    test("is function?", async () => {
        expect(typeof getUsers).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof postUsers).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof putUsers).toBe("function")
    })
    test("is function?", async () => {
        expect(typeof deleteUsers).toBe("function")
    })
})
