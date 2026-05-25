const accountModel = require("../models/account.model");

async function accountCreation(req, res) {
  try {
    const user = req.user;

    // Safety check
    if (!user || !user._id) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Prevent duplicate account
    const existingAccount = await accountModel.findOne({
      user: user._id,
    });

    if (existingAccount) {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    // Create account
    const account = await accountModel.create({
      user: user._id,
    });

    return res.status(201).json({
      message: "Account Created Successfully",
      account,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
}

async function getallAccounts (req,res){

    const accounts = await accountModel.find({
      user : req.user._id
    })

    res.status(200).json({
      accounts
    })
}


async function getBalance(req,res){
  
   const{accountId} = req.params;

   const account = await accountModel.findOne({
      _id : accountId,
      user : req.user._id
   })

   if(!account){
    return res.status(402).json({
      message : "Account not Found"
    })
   }

   const balance = await account.getBalance()
   console.log(balance)

   return res.status(200).json({
     message : "Balance Fetched Sucessfully",
     accountId : account._id,
     balance : balance
   })
}

module.exports = {
  accountCreation,
  getallAccounts,
  getBalance
};