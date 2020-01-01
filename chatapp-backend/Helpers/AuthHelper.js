const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');
const HttpStatus = require('http-status-codes');

module.exports = {
    VerifyToken : (req,res,next)=>{

        if(!req.headers.authorization){
             return res.status(HttpStatus.UNAUTHORIZED).json({message:'No Authorization'});
        }
        const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
        // co÷nsole.log(token);
        //  console.log(req.headers);
        if(!token){
            return res.status(HttpStatus.FORBIDDEN).json({message:'No token provided'});
        }
        return jwt.verify(token,dbConfig.secret,(err,decoded)=>{
             if(err){
                 if(err.expiredAt < new Date()){
                     return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .json({message:"Token has expired .Please Login again ",token:null});
                 }
                 next();
             }
             req.user = decoded.data;
             next();
        })
    }
}