const express = require("express")
const accountController = require("../controllers/account.controllers")
const authMiddleware = require("../middleware/auth.middleware")


const router = express.Router()

router.post("/",authMiddleware.authMiddleware,accountController.accountCreation)
router.get("/get",authMiddleware.authMiddleware,accountController.getallAccounts)
router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getBalance)


module.exports = router