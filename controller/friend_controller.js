const Friends=require('../models/friends');
const User=require('../models/user');


module.exports.toggle_friend=async function(req,res){

    try {
        let friendship=await Friends.findOne({requestBy:{$in:[req.user.id,req.params.id]},requestTo:{$in:[req.user.id,req.params.id]}});
        let alreadyExists;
        if(!friendship){
            friendship=await Friends.create({requestBy:req.params.id,requestTo:req.user.id});
            alreadyExists=false;
        }else{
            alreadyExists=true;
        }
        let user1=await User.updateOne({_id:req.params.id},{$pull:{sendedRequest:req.user.id}});
        let user2=await User.updateOne({_id:req.user.id},{$pull:{friendRequests:req.params.id}});
        let friend=await User.findById(req.params.id);
        if(req.xhr){
            return res.json(200,{
                alreadyExists:alreadyExists,
                friendName:friend.name,
                friendshipId:friendship.id,
                profile_pic:friend.avatar
            });
        }
    
    } catch (error) {
        console.log(error);
        return res.json(500,{
            message:'Internal Server Error'
        });
    }
}
module.exports.reject=async function(req,res){


    try {
        
        let user1=await User.updateOne({_id:req.params.id},{$pull:{sendedRequest:req.user.id}});
        let user2=await User.updateOne({_id:req.user.id},{$pull:{friendRequests:req.params.id}});
        return res.json(200,{
            message:'success'
        });
    } catch (error) {
        return res.json(500,{
            message:'internal server error'
        })
    }



}
module.exports.destroy=async function(req,res){
    console.log('req.params.removedBy',req.params.removedBy);
    console.log('req.params',req.user.id);
    console.log(req.params.removedBy==req.user.id);
    if(req.params.removedBy==req.user.id){
        await Friends.findOneAndDelete({requestBy:{$in:[req.user.id,req.params.removedTo]},requestTo:{$in:[req.user.id,req.params.removedTo]}});
        let removedUser=await User.findById(req.params.removedTo);
        if(req.xhr){
            return res.json('200',{
                removedUserName:removedUser.name,
                removedUserAvatar:removedUser.avatar,
                removedUserId:removedUser.id
            });
        }
    }else{
        res.redirect('back');
    }

}
