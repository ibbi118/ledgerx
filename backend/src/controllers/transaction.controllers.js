const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ladger.model")
const accountModel = require("../models/account.model")
const { default: mongoose } = require("mongoose")
const ladgerModel = require("../models/ladger.model")
const userModel = require("../models/user.models");

const {
  sendTransactionSuccessMail,
  sendTransactionFailedMail,
} = require("../services/email.services");




// STEP 1: Validate request (toAccount, amount > 0, idempotencyKey required)

// STEP 2:step2 validate idmKey (if transaction with same key exists → return it)

// STEP 3: step3 check account status 

// STEP 4: Derive sender balance from ladger

// STEP 5: Create transaction record (status: PENDING)

// STEP 6: Start DB session (startSession + startTransaction)

// STEP 7: Create transaction record (status: PENDING)

// STEP 8: Create ledger entries (DEBIT fromAccount, CREDIT toAccount using session)

// STEP 9: Update transaction status (COMPLETED) + commitTransaction / abort on error

// step 10 : email notification




async function createTransaction(req,res){

    const session = await mongoose.startSession()

    try{

    //  1  Validate request

    const{fromAccount,toAccount,amount,idempotencyKey} = req.body
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "fromAccount , toAccount , Amount and IdempotencyKey must be required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message : "Invalid fromAccount or toAccount"
        })
    }

    // step2 validate idmKey

    const alreadyTransactionExists = await transactionModel.findOne({
        idempotencyKey : idempotencyKey
    })

    if(alreadyTransactionExists){
        if(alreadyTransactionExists.status == "COMPLETED"){
            return res.status(200).json({
                message : "This Transaction Already Successfully Completed",
                transaction : alreadyTransactionExists
            })
        }
        
        if(alreadyTransactionExists.status == "PENDING"){
            return res.status(200).json({
                message : "Transaction still in progress"
            })
        }

        if(alreadyTransactionExists.status == "FAILED"){
            return res.status(200).json({
                message : "Transaction is Failed, Please retry"
            })
        }

        if(alreadyTransactionExists.status == "REVERSED"){
            return res.status(200).json({
                message : "This Transaction is Reversed, Retry again"
            })
        }
    }
  
    //step3 check account status

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
        message : "Both fromAccount and toAccount Status must be Active"
        })  
    }

    //step4 Derive sender balance from ladger

    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        return res.status(400).json({
            message : "Insufficent Balance"
        })
    }

    //Step5 Create transaction record (status: PENDING)

    session.startTransaction()

    const transaction = (await transactionModel.create([{
       fromAccount,
       toAccount,
       amount,
       idempotencyKey,
       status : "PENDING"
    }],{session}))[0]
    
    const debitLedgerEntry = await ledgerModel.create([{
        account : fromAccount,
        amount : amount,
        transaction : transaction._id,
        type : "DEBIT"
    }],{session})


    await(()=>{
        return new Promise((res)=> setTimeout(res,40*1000));
    })()
     
    const creditLedgerEntry = await ledgerModel.create([{
    
         account : toAccount,
         amount : amount,
         transaction : transaction._id,
         type : "CREDIT"

    }],{session})

    await transactionModel.findByIdAndUpdate(
    transaction._id,
    { status: "COMPLETED" },
    { session }
)

    await session.commitTransaction()
    session.endSession()

    // ✅ EMAILS (success)
    const sender = await userModel.findById(fromUserAccount.user)
    const receiver = await userModel.findById(toUserAccount.user)

  sendTransactionSuccessMail(sender, { ...transaction._doc, type: "DEBIT" })
 sendTransactionSuccessMail(receiver, { ...transaction._doc, type: "CREDIT" })


    res.status(202).json({
        message : "Transaction Created Successfully",
        transaction : transaction
    })

    }catch(err){

       if (session.inTransaction()) {
         await session.abortTransaction();
       }
         session.endSession();
         
    if (
        err.message.includes("WriteConflict") ||
        err.message.includes("Please retry your operation")
    ) {
        return res.status(200).json({
            message: "Transaction is in progress, please wait..."
        });
    }
        // ❌ FAILED EMAIL
        try{
            const acc = await accountModel.findById(req.body.fromAccount)
            if(acc){
                const user = await userModel.findById(acc.user)
                if(user){
                    sendTransactionFailedMail(user, err.message)
                }
            }
        }catch(e){
            console.log("Email error", e.message)
        }

        return res.status(500).json({
            message : "Transaction Failed",
            error : err.message
        })
    }

}

async function systemInitalFund(req,res){

    const session = await mongoose.startSession()

    try{

    const {toAccount,amount,idempotencyKey} = req.body
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "To account , amount and key is required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })

    if(!toUserAccount){
        return res.status(400).json({
            message : "Invalid toUserAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user : req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message : "System User Not Found"
        })
    }

    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey
    })

    const debitLedgerEntry = await ladgerModel.create([{
        account : fromUserAccount._id,
        amount,
        transaction : transaction._id,
        type : "DEBIT"
    }],{session})

    const creditLedgerEntry = await ladgerModel.create([{
        account : toAccount,
        amount,
        transaction : transaction._id,
        type : "CREDIT"
    }],{session})
  
     transaction.status = "COMPLETED"
     await transaction.save()
     
     await session.commitTransaction()
     session.endSession()

     // ✅ CREDIT EMAIL ONLY
     const receiver = await userModel.findById(toUserAccount.user)

     sendTransactionSuccessMail(receiver, {
        ...transaction._doc,
        type : "CREDIT"
     })

     res.status(202).json({
        message : "Initial fund successfully transfered ",
        transaction : transaction
     })

    }catch(err){

        await session.abortTransaction()
        session.endSession()

        // ❌ FAILED EMAIL (optional but added)
        try{
            if(req.body?.toAccount){
                const acc = await accountModel.findById(req.body.toAccount)
                if(acc){
                    const user = await userModel.findById(acc.user)
                    if(user){
                        sendTransactionFailedMail(user, err.message)
                    }
                }
            }
        }catch(e){
            console.log("Email error", e.message)
        }

        return res.status(500).json({
            message : "Initial fund failed",
            error : err.message
        })
    }
}


async function getMyTransactions(req, res) {
  try {
    // Step 1: Get all account IDs belonging to this user
    const userAccounts = await accountModel.find(
      { user: req.user._id },
      { _id: 1 }
    );

    if (!userAccounts.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        transactions: [],
      });
    }

    const accountIds = userAccounts.map((acc) => acc._id);

    // Step 2: Find transactions where user is sender OR receiver
    const transactions = await transactionModel
      .find({
        $or: [
          { fromAccount: { $in: accountIds } },
          { toAccount:   { $in: accountIds } },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message,
    });
  }
}



module.exports = {
    systemInitalFund,
    createTransaction,
    getMyTransactions
}