
const Joi = require('joi');
const User  = require('../models/userModels');
const httpStatus = require('http-status-codes');

module.exports = {
    async getAllUsers(req,res){
      try{
        const users = await User.find().populate('posts.postId')
        .populate('following.userFollowed')
        .populate('followers.follower')
        return res.status(httpStatus.OK).json({message:"user fetched successs fully",users});
      } catch(err){
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"error occured"+err});
      } 
      
    },
    async getUserById(req,res){
       try{
            const user = await User.findOne({_id:req.params.id})
            .populate('posts.postId')
            .populate('following.userFollowed')
        .populate('followers.follower')
            return res.status(httpStatus.OK).json({message:"Get User By Id",user});
       }catch(err){
           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"eror occured",err});
       }
    },

    async getUserByUsername(req,res){
        try{
            const result = await User.findOne({username:req.params.username})
            .populate('posts.postId')
            .populate('following.userFollowed')
        .populate('followers.follower')
            return res.status(httpStatus.OK).json({message:"Get user by name ",result});
            
        }catch(err){
            
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"Error occured",err});
        }
    }
}