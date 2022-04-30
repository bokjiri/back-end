const httpMocks = require("node-mocks-http")

describe("basic test", () => {
    test("This is a sample", () => {
        expect(true).toBe(true)
    })
})

// const { getUsers, postUsers, putUsers, deleteUsers } = require("../user.controller")
// let req = httpMocks.createRequest()
// let res = httpMocks.createResponse()

// describe("type test", () => {
//     test("is function?", async () => {
//         expect(typeof getUsers).toBe("function")
//     })
//     test("is function?", async () => {
//         expect(typeof postUsers).toBe("function")
//     })
//     test("is function?", async () => {
//         expect(typeof putUsers).toBe("function")
//     })
//     test("is function?", async () => {
//         expect(typeof deleteUsers).toBe("function")
//     })
// })

// describe("getUsers should return", () => {
//     it("the statusCode 200", async () => {
//         const GUs = await getUsers(req, res)
//         expect(GUs.statusCode).toEqual(200)
//     })
// })
// describe("postUsers should return", () => {
//     it("the statusCode 201", async () => {
//         const PUs = await postUsers(req, res)
//         expect(PUs.statusCode).toEqual(201)
//     })
// })
// describe("putUsers should return", () => {
//     it("the statusCode 200", async () => {
//         const PUs = await putUsers(req, res)
//         expect(PUs.statusCode).toEqual(200)
//     })
// })
// describe("deleteUsers should return", () => {
//     it("the statusCode 200", async () => {
//         const DUs = await deleteUsers(req, res)
//         expect(DUs.statusCode).toEqual(200)
//     })
// })
