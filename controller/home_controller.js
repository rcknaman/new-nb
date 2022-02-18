const posts = require('../models/post');
const User=require('../models/user');
const Chatroom=require('../models/chatRoom');
const Friends=require('../models/friends');
module.exports.home = async function (req, res) {

    //this piece of code will not work if we want to display the author of the posts as well along with
    // their posts because we have saved the user id with their corresponding posts in the database
    //so we need to first fetch the name of the author with the help of their user id .



    // posts.find({},function(err,post_data){
    //     if(err){
    //         console.log('error in home-controller');
    //         return err;
    //     }
    //     return res.render('home',{
    //         title:'Codial',
    //         posts:post_data
    //     });
    // });

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
        if(req.user){
            await req.user.populate({path:'friends'});
        }
    
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
        select:'name'
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
        select:'name'
    })
    .populate({
        path:'requestTo',
        select:'name'
    });
    let userFriends2=await Friends.find({requestTo:{$in:[req.user.id]}})

    .populate({
        path:'requestBy',
        select:'name'
    })
    .populate({
        path:'requestTo',
        select:'name'
    });
    
    let userFriends=userFriends1.concat(userFriends2);
    let userfriendId=new Array();
    for(let friend of userFriends){
        console.log(friend.requestBy._id,',',req.user._id);
        if(friend.requestBy._id.toString()==req.user._id.toString()){
            console.log('hello bc');
            userfriendId.push(friend.requestTo._id);
        }else{
            console.log('lund');
            userfriendId.push(friend.requestBy._id);
        }
        
    }
    let user=await User.find({_id:{$nin:userfriendId}});
    return res.render('new_home', {
        title: 'Codial',
        posts: post_data,
        all_users:user,
        userFriends:userFriends,
        myProfile:myProfile
    });


    }else{


        return res.redirect('/users/signin');
    }

}


