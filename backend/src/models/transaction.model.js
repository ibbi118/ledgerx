const mongoose = require("mongoose")


const transactionSchema = new mongoose.Schema({
    fromAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : true,
        index : true
    },
    toAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "account",
        required : true,
        index : true
    },
    status : {
        type: String,
        enum : {
            values : ["PENDING","COMPLETED","FAILED","REVERSED"],
            message : "transaction status can either be pending,completed,failed or reversed"
        },
        default : "Pending"
    },
    amount : {
        type : Number,
        required : true,
        min : [0,"Transaction amount cannot be negative"]
    },
    idempotencyKey : {
        type : String,
        required:true,
        unique : true,
        idex:true
    }
},{
    timestamps : true
})



const transactionModel = mongoose.model("transaction",transactionSchema)

module.exports = transactionModel