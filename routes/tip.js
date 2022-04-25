const router = require('express').Router();
const tipController = require("../controllers/tipController")


router.use("/", tipController.getTips)


module.exports = router