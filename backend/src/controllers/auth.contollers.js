const userModel = require("../models/user.models")
const jwt = require("jsonwebtoken")
const emailServices = require("../services/email.services");
const blacklistModel = require("../models/tokenBlacklist.model");

async function userRegister(req,res){
    try{
      
        const{email,username,password} = req.body;

        if (!email || !username || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

        const isExists = await userModel.findOne({
            email
        }) 

        if(isExists){
            return res.status(422).json({
                message : "User already exit"
            })
        }
       
        const user = await userModel.create({
            email,username,password
        })

        const token = jwt.sign({userId : user._id},process.env.JWT_SECRET,{expiresIn : "3d"})

        res.cookie("token",token)

        res.status(201).json({
            message : "User register successfully",
            user  : {
                email : user.email,
                username : user.username
            },
            token
        })
     
         emailServices.sendRegistrationMail(user).catch(err =>
         console.error("Email error:", err)
        );



    }catch(err){
        console.log(err)
    }
}


async function userLogin(req,res){
    try{
      const {email,password} = req.body;
      if(!email || !password){
        return res.status(400).json({
            meesage : "All fields must be requires"
        })
      }

      const findUser = await userModel.findOne({
        email
      }).select("+password")

      if(!findUser){
        return res.status(422).json({
            message : "Invalid credentials"
        })
      }

      const checkPass = findUser.comparePassword(password)

      if(!checkPass){
        return res.status(422).json({
            message : "Invalid credentials"
        })
      }

       const token = jwt.sign({userId : findUser._id},process.env.JWT_SECRET,{expiresIn : "3d"})

        res.cookie("token",token)
        
        res.status(200).json({
            message : "User Login successfully",
            user  : {
                email : findUser.email,
                username : findUser.username
            },
            token
        })


        emailServices. sendLoginMail(findUser).catch(err =>
         console.error("Login email error:", err)
       );

    }catch(err){
     console.log(err)
    }
}

async function userLogout(req,res){
    const token = req.cookies.token || req.headers.authorization?.split("")[1]

    if(!token){
        return res.status(200).json({
            message : "User already Logout"
        })
    }

    const blacklistToken = await blacklistModel.create({
        token : token
    })

    res.setCookies("")

    return res.status(200).json({
        message : "User Successfully Logout"
    })
}

module.exports = {
    userRegister,
    userLogin,
    userLogout
}