const Joi = require('joi');
const User = require('../models/userModels');
const HttpStatus = require('http-status-codes');
const Helpers = require('../Helpers/helper');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');
module.exports={

    async CreateUser(req,res){


       const schema = Joi.object().keys({
           username: Joi.string().min(5).max(10).required(),
           email: Joi.string().email().required(),
           password: Joi.string().min(5).required()
       })

       const {error,value}=Joi.validate(req.body,schema);
    //    console.log(value);
       if(error && error.details){
           return res.status(HttpStatus.BAD_REQUEST).json({msg:error.details});
       }
    
       const userEmail = await User.findOne({email:Helpers.lowerCase(req.body.email)});

       if(userEmail){
           return res.status(HttpStatus.CONFLICT).json({message:"email already exist"});
           
             
       }

       const username = await User.findOne({username:Helpers.firstUpper(req.body.username)});

       if(username){
        return res.status(HttpStatus.CONFLICT).json({message:"username already exist"});
        
        }

       return bcrypt.hash(value.password,10,(err,hash)=>{
                if(err){
                    return res.status(HttpStatus.BAD_REQUEST).json({message:"Error in hashing password"});
                   
                }

                const body = {
                      username : Helpers.firstUpper(value.username),
                      email : Helpers.lowerCase(value.email),
                      password: hash
                }

                User.create(body).then((user)=>{ 
                    const token = jwt.sign({data:user},dbConfig.secret,{
                         expiresIn: "5h"

                    })
                    res.cookie('auth',token);

                    return res.status(HttpStatus.CREATED).json({message:"User Created Successfully",user,token});
                }).catch(err => {
                    return res.status(HttpStatus.BAD_REQUEST).json({message:"Error inb user Creation"});
                     
                })
       });
    },


       async LoginUser(req,res){
             if(!req.body.username || !req.body.password){
                  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'No empty Field Allowed'});
             }
        
             await User.findOne({username: Helpers.firstUpper(req.body.username)})
             .then(user=>{
                   if(!user){
                       return res.status(HttpStatus.NOT_FOUND).json({message:'Username not found'});
                   }

                   return bcrypt.compare(req.body.password,user.password).then(result=>{
                          if(!result){
                            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Password is incorrect'});
                          }

                          const token = jwt.sign({data:user},dbConfig.secret,{
                               expiresIn: "5h"
                               
                          });

                          res.cookie('auth',token);
                          return res.status(HttpStatus.OK).json({message:'Login Successfull',user,token})
                   })
             })
             .catch(err=>{
                 return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Error occured'})
             })
    }
 
}