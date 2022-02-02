const Friends=require('../models/friends');
const User=require('../models/user');


module.exports.toggle_friend=async function(req,res){

    try {
        let friendship=await Friends.findOne({requestBy:{$in:[req.user.id,req.params.id]},requestTo:{$in:[req.user.id,req.params.id]}});
        let deleted;
        // console.log('friendship: ',friendship);
        // friendship=friendship.length;
        console.log('friendship: ',friendship);
        if(friendship){
            await Friends.findOneAndDelete({requestBy:{$in:[req.user.id,req.params.id]},requestTo:{$in:[req.user.id,req.params.id]}});
    
            await User.findByIdAndUpdate(req.user.id,{$pull:{friends:req.params.id}});
            await User.findByIdAndUpdate(req.params.id,{$pull:{friends:req.user.id}});
            deleted=true;
    
        }else{
            await Friends.create({requestBy:req.user.id,requestTo:req.params.id});
            let user1=await User.findByIdAndUpdate(req.user.id,{$push:{friends:req.params.id}});
            let user2=await User.findByIdAndUpdate(req.params.id,{$push:{friends:req.user.id}});
            console.log('user1: ',user1);
            console.log('user2: ',user2);
            deleted=false;
        }
        console.log('deleted: ',deleted);
        if(req.xhr){
            return res.json({
                data:{
                    deleted:deleted
                }
            });
        }

    } catch (error) {
        console.log(error);
        return res.json(500,{
            message:'Internal Server Error'
        });
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
