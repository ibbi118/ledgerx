require("dotenv").config()
const app = require("./src/app")
const connecttoDB = require("./src/config/db.config")

connecttoDB()

app.listen(3000,()=>{
    console.log("server running at port 3000")
})