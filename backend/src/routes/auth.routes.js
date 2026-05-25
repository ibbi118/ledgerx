const express = require("express")
const routes = express.Router()
const authController = require("../controllers/auth.contollers")
const router = require("./account.routes")
const authMiddleware  = require("../middleware/auth.middleware")

routes.post("/register",authController.userRegister)
routes.post("/login",authController.userLogin)
router.post("logout",authMiddleware.authMiddleware,authController.userLogout)


module.exports = routes