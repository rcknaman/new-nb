const posts = require('../models/post');
const User=require('../models/user');
const Chatroom=require('../models/chatRoom');
const Message=require('../models/message');
const Friends=require('../models/friends');
const Groups=require('../models/group');
module.exports.home = async function (req, res) {

    //this piece of code will not work if we want to display the author of the posts as well along with
    // their posts because we have saved the user id with their corresponding posts in the database
    //so we need to first fetch the name of the author with the help of their user id .

    //so the syntax will slightly change inorder to pre populate the details of the user

    //here the 'user' is from the post schema which stores the id of every user..so in the argument
    //of populate we put that entity on the basis of which we could find the details of the user
    if(req.user){

        let post_data=await posts.find({})
        .populate('user')
        .sort('-createdAt')
        //here this is another syntax via which we can populate the array..if we are given
        //an array of ids..we dont need to specify the model from where they should fetch
        //and populate the array as in their schema there is already mentioned the 'ref' attribute
        //which signifies the reference of the selescted array id's
        .populate({
            path: 'comments',
            populate: {
                path:'user likes'
            }
        })  
        .populate({
            path:'likes',
            select:'user reaction'
        })
    
    let myProfile;

    myProfile=await User.findById(req.user._id)
    .populate({
        path:'chatroom',
        populate:{
            path:'messageId'
        }
    })
    .populate({
        path:'friendRequests',
        select:'name avatar'
    })
    .populate({
        path:'sendedRequest',
        select:'name'
    })
    .populate({
        path:'reqAcceptedNotif',
        select:'name'
    });

    let userFriends1=await Friends.find({requestBy:{$in:[req.user.id]}})
    
    .populate({
        path:'requestBy',
        select:'name avatar'
    })
    .populate({
        path:'requestTo',
        select:'name avatar'
    });
    let userFriends2=await Friends.find({requestTo:{$in:[req.user.id]}})

    .populate({
        path:'requestBy',
        select:'name avatar'
    })
    .populate({
        path:'requestTo',
        select:'name avatar'
    });
    
    let userFriends=userFriends1.concat(userFriends2);
    let userfriendId=new Array();
    let newMsgCheck=new Array();
    
    for(let friend of userFriends){
        if(friend.requestBy._id.toString()==req.user._id.toString()){
            userfriendId.push(friend.requestTo._id);
        }else{
            userfriendId.push(friend.requestBy._id);
        }
        if(friend.messageId.length){
            msgArraySize=friend.messageId.length;
            let lastMsg=await Message.findById(friend.messageId[msgArraySize-1]).populate();
            if(lastMsg.sentBy.toString()==req.user.id.toString()){
                newMsgCheck.push('true');
            }else{

                if(lastMsg.seen=='false'){
                    newMsgCheck.push('false');
                }else{
                    newMsgCheck.push('true');
                }   
            }
        }
        else{
            newMsgCheck.push('true');
        }
    }
    let user=await User.find({_id:{$nin:userfriendId}});
    let groups=await Groups.find({$or:[{users:req.user.id},{admin:req.user.id}]});
    console.log('groups',groups);
    return res.render('new_home', {
        title: 'Codial',
        posts: post_data,
        all_users:user,
        userFriends:userFriends,
        myProfile:myProfile,
        newMsgCheck:newMsgCheck,
        userfriendId:userfriendId,
        groups:groups
    });


    }else{


        return res.redirect('/users/signin');
    }

}


