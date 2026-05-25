const blacklistModel = require("../models/tokenBlacklist.model");
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  
    // Get token from cookie or header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
      });
    }

     const isBlackist = await blacklistModel.findOne({token})
      if(isBlackist){
        return res.status(401).json({
          message : "Unauthorizes access, token is invalid"
        })
      }

      try{
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    return next();
  } 
  catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

async function systemMiddleware(req,res,next){
   const token = req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];


      if(!token){
        return res.status(401).json({
          message : "Token not found"
        })
      }

      const isBlackist = await blacklistModel.findOne({token})
      if(isBlackist){
        return res.status(401).json({
          message : "Unauthorizes access, token is invalid"
        })
      }

      try{
        
       const decoded = jwt.verify(token,process.env.JWT_SECRET)

       const user = await userModel.findById(decoded.userId).select("+systemUser")

       if(!user.systemUser){
        return res.status(403).json({
          message : "System User Not found"
        })
       }

       req.user = user

       return next()


      }catch(err){
        return res.status(401).json({
          message : "Invalid or expired token"
        })
      }
}

module.exports = {
  authMiddleware,
  systemMiddleware
}