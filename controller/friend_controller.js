const Friends=require('../models/friends');
const User=require('../models/user');


module.exports.toggle_friend=async function(req,res){

    try {
        let friendship=await Friends.findOne({requestBy:{$in:[req.user.id,req.params.id]},requestTo:{$in:[req.user.id,req.params.id]}});
        let alreadyExists;
        // console.log('friendship: ',friendship);
        // friendship=friendship.length;
        console.log('friendship: ',friendship);
        if(!friendship){
            await Friends.create({requestBy:req.params.id,requestTo:req.user.id});
            alreadyExists=false;
        }else{
            alreadyExists=true;
        }
        let user1=await User.updateOne({_id:req.params.id},{$pull:{sendedRequest:req.user.id}});
        let user2=await User.updateOne({_id:req.user.id},{$pull:{friendRequests:req.params.id}});
        let friend=await User.findById(req.params.id);
        console.log('friendname',friend.name);
        if(req.xhr){
            return res.json(200,{
                alreadyExists:alreadyExists,
                friendName:friend.name
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
        // console.log('user1:',user1);
        // console.log('user2:',user2);
        // console.log('user1:',req.params.id);
        // console.log('user2:',req.user.id);
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
    await Friends.findOneAndDelete({requestBy:{$in:[req.user.id,req.params.id]},requestTo:{$in:[req.user.id,req.params.id]}});

    await User.findByIdAndUpdate(req.user.id,{$pull:{friends:req.params.id}});
    await User.findByIdAndUpdate(req.params.id,{$pull:{friends:req.user.id}});
    if(req.xhr){
        return res.json('200',{
            message:'deletion successful'
        })
    }
}
