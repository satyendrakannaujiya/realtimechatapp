const Joi = require('joi');
const User  = require('../models/userModels');
const httpStatus = require('http-status-codes');

module.exports={
    followUser(req,res){
        const followUser = async () =>{
             await User.update({
                 _id: req.user._id,
                 "following.userFollowed":{$ne : req.body.userFollowed}
             },{
                 $push: {
                     following:{
                         userFollowed: req.body.userFollowed
                     }
                 }
             }),
             await User.update({
                _id: req.body.userFollowed,
                "followers.follower":{$ne : req.user._id}
            },
            {
                $push: {
                    followers:{
                        follower: req.user._id
                    },
                    notifications: {
                        senderId: req.user._id,
                        message: `${req.user.username} is now following you`,
                        created: new Date()
                    }
                }
            })

        };

        

        followUser().then(()=>{
              res.status(httpStatus.OK).json({message:"Following user now "})
        }).catch(err=>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'Error occured',err});
        })
    },

    unFollowUser(req,res){
        const UnfollowUser = async () =>{
             await User.update({
                 _id: req.user._id
                 
             },{
                 $pull: {
                     following:{
                         userFollowed: req.body.userFollowed
                     }
                 }
             }),
             await User.update({
                _id: req.body.userFollowed
                
            },
            {
                $pull: {
                    followers:{
                        follower: req.user._id
                    }
                }
            })

        };

        UnfollowUser().then(()=>{
              res.status(httpStatus.OK).json({message:"UnFollowing user now "})
        }).catch(err=>{
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'Error occured'});
        })
    },
    async markNotification(req,res){
        if(!req.body.deleteVal){
          await User.updateOne({
              _id: req.user._id,
              'notifications._id':req.params.id
          },{
              $set: {
                    'notifications.$.read':true
              }
          }).then(()=>{
              res.status(httpStatus.OK).json({message:'Marked as read'});
          }).catch(err=>{
              res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'Error occured'})
          })
        }
        else{
            await User.update({
                _id: req.user._id,
                'notifications._id':req.params.id
            },{
                $pull:{
                     notifications: {
                         _id: req.params.id
                     }
                }
            }).then(()=>{
                res.status(httpStatus.OK).json({message:'Deleted Successfully'});
            }).catch(err=>{
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'Error occured'})
            })
        }

    }
}