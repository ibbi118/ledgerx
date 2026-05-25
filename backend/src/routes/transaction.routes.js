const express = require("express")

const transactionRouter = express.Router()
const transactionController = require("../controllers/transaction.controllers")
const authMiddleware = require("../middleware/auth.middleware")



transactionRouter.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)

transactionRouter.post("/system/initial-fund",authMiddleware.systemMiddleware,transactionController.systemInitalFund)

transactionRouter.get("/get",authMiddleware.authMiddleware,transactionController.getMyTransactions)




module.exports = transactionRouter