const Message=require('../models/message');
const Friends=require('../models/friends');
const User=require('../models/user');
module.exports.createMessage=async function(req,res){


    console.log('message: ',req.body.message);
    let message=await Message.create({
        message:req.body.message,
        sentBy:req.user.id,
        type:'private'
    });
    let friendship=await Friends.updateOne({
        requestBy:{$in:[req.user.id,req.body.sentTo]},
        requestTo:{$in:[req.user.id,req.body.sentTo]}
    },
    {
        $push:{messageId:message._id}
    });
    // await Friends.updateOne({_id:req.body.friendshipId},{$push:{messageId:message._id}});
    return res.json(200,{

        data:{
            message:message.message,
            sentTo:req.body.sentTo,
            sentBy:req.user.id,
            messageId:message.id
        }

    });

}
module.exports.seen=async function(req,res){

    let message=await Message.findById(req.params.messageId);
    message.seen='true';
    message.save();
    return res.json(200,{
        message:'message seen'
    });

}
module.exports.loadMessage=async function(req,res){

    let friendship=await Friends.findOne({requestBy:{$in:[req.user.id,req.params.friendId]},requestTo:{$in:[req.user.id,req.params.friendId]}})
    .populate({
        path:'messageId',
        populate:{
            path:'sentBy',
            select:'name'
        }
    });
    let FriendArrayLength=friendship.messageId.length;
    for(let i=FriendArrayLength-1;i>=0;i--){

        if(friendship.messageId[i].seen=='true'){
            break;
        }else{
            await Message.findByIdAndUpdate(friendship.messageId[i],{seen:'true'});
        }

    }
    return res.json(200,{
        data:{
            messages:friendship.messageId
        }
    });
}

module.exports.messagepage= async function(req,res){


    let friend=await User.findById(req.params.friendId);

    let friendship=await Friends.findOne({requestBy:{$in:[req.user.id,req.params.friendId]},requestTo:{$in:[req.user.id,req.params.friendId]}})
    .populate({

        path:'messageId',
    });
    let FriendArrayLength=friendship.messageId.length;
    for(let i=FriendArrayLength-1;i>=0;i--){

        if(friendship.messageId[i].seen=='true'){
            break;
        }else{
            await Message.findByIdAndUpdate(friendship.messageId[i],{seen:'true'});
        }

    }

    return res.render('chatpage',{friendOrGroupId:req.params.friendId,layout:'chatpage',name:friend.name,messages:friendship.messageId});


}