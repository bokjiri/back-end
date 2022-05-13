const swaggerAutogen = require("swagger-autogen")()

const doc = {
    info: {
        title: "My API",
        description: "Description",
    },
    host: "jwprac.shop",
    schemes: ["https"],
}

const outputFile = "./swagger-output.json"
const endpointsFiles = ["./app.js"]

swaggerAutogen(outputFile, endpointsFiles, doc)
