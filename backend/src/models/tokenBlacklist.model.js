const mongoose  = require("mongoose")

const blacklistSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true,
        immutable:true
    }
},{
    timestamps:true
})

blacklistSchema.index({createdAt : 1},{
    expireAfterSeconds : 60*60*24*3 //3days kay bad khudi del hu jae ga db sy
})


const blacklistModel = mongoose.model("blacklist",blacklistSchema)

module.exports = blacklistModel