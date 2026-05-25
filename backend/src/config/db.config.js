const mongoose = require("mongoose")

function connecttoDB(){
    mongoose.connect(process.env.MONGOOSE_URI)
    .then((res)=>{
        console.log("database connected successfully")
    })
    .catch((err)=>{
        console.log(err)
        process.exit(1)
    })
}

module.exports = connecttoDB