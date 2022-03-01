const database=require('../models/user');

const path=require('path');
const fs=require('fs');
const Friends=require('../models/friends');
const crypyo=require('crypto');
const Message=require('../models/message');
let Posts=require('../models/post');
let Groups=require('../models/group');
const UpdatePasswordTokenMailer=require('../mailer/update_password_link');

const accessTokenModel=require('../models/accessToken_modal');
const { log } = require('console');
module.exports.profile=async function(req,res){

    
    // let friendship=await Friends.findOne({requestBy:{$in:[req.params.id,req.user.id]},requestTo:{$in:[req.params.id,req.user.id]}});

    let myProfile;

    myProfile=await database.findById(req.user._id)
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
    let Alluser=await database.find({_id:{$nin:userfriendId}});
    let profileDetails=await database.findById(req.params.id);

    // when the user had friend requested to end user
    let friendship1=await Friends.find({requestBy:{$in:[req.params.id]}});
    let friendship2=await Friends.find({requestTo:{$in:[req.params.id]}});
    let friendship=friendship1.concat(friendship2);
    let isFriend=await Friends.findOne({requestBy:{$in:[req.user.id,req.params.id]},requestTo:{$in:[req.user.id,req.params.id]}});
    let posts=await Posts.find({user:req.params.id})
    .populate('user')
    .sort('-createdAt')
    .populate({
        path: 'comments',
        populate: {
            path:'user likes'
        }
    })  
    .populate({
        path:'likes',
        select:'user reaction'
    });
    let groups=await Groups.find({$or:[{users:req.user.id},{admin:req.user.id}]});
    console.log('userctrl friedn',!!isFriend);
    return res.render('new_profile', {
        title: 'codial|profile page',
        all_users:Alluser,
        userFriends:userFriends,
        myProfile:myProfile,
        newMsgCheck:newMsgCheck,
        userfriendId:userfriendId,
        friendCount:friendship.length,
        profileDetails:profileDetails,
        postsCount:posts.length,
        posts:posts,
        isFriend:!!isFriend,
        groups:groups
    });

}
module.exports.sessionCheck=function(req,res){
    if(req.user){
        return res.json(200,{
            data:{
                allowed:'yes'
            }
        });
    }else{
        return res.json(200,{
            data:{
                allowed:'no'
            }
        });
    }
}
module.exports.fetchNotifs=async function(req,res){

    let user=req.user.populate({
        path:'friendRequests',
        select:'name _id'
    });
    return res.json(200,{

        data:{
            user:user
        }
    })

}
module.exports.deleteNotifs=async function(req,res){


    if(req.params.typeof=='reqAccepted'){
        await database.updateOne({'_id':req.user.id},{$pull:{reqAcceptedNotif:req.params.id}});
    }else if(req.params.typeof='post_liked'){
        await database.updateOne({'_id':req.user.id},{$pull:{postLiked:{assetId:req.params.postid,userid:req.params.id}}});
    }
    
    return res.json(200,{
        message:'success'
    });

}
module.exports.signin=function(req,res){
    //if the user is already signed in on his system then he must get redirected to his profile page 
    //in place of signin page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('new_signin',{
        title:'codial|signin',
        layout:'new_signin'
    });
}

module.exports.signup=function(req,res){
    //if the user is already signed in on his system then he must get redirected to his profile page 
    //in place of signup page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('new_signup',{
        title: 'codial|signup',
        layout:'new_signup'
    })
}

module.exports.friendAndGroups=async function(req,res){

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
    let groups=await Groups.find({$or:[{users:req.user.id},{admin:req.user.id}]});



    res.render('friends&groups',{layout:'friends&groups',newMsgCheck:newMsgCheck,userFriends:userFriends,groups:groups});
}

module.exports.findFriends=async function(req,res){

    

    let userFriends1=await Friends.find({requestBy:{$in:[req.user.id]}});
    let userFriends2=await Friends.find({requestTo:{$in:[req.user.id]}});
    
    let userFriends=userFriends1.concat(userFriends2);
    let userfriendId=new Array();
    
    for(let friend of userFriends){
        if(friend.requestBy._id.toString()==req.user._id.toString()){
            userfriendId.push(friend.requestTo._id);
        }else{
            userfriendId.push(friend.requestBy._id);
        }
    }

    let all_users=await database.find({_id:{$nin:userfriendId}});



    return res.render('findFriends',{layout:'findFriends',users:all_users});
}





module.exports.create= function(req,res){

    database.uploadedAvatar(req,res,function(err){

        database.findOne({'email': req.body.email}, function(err,user){
            if(err){
                console.log('error in finding the user in signing up');
                return res.redirect('back');
            }
            if(!user){
                //here req.body is the data which we are saving and only that data is saved which is 
                //present in schema i.e. confirm password will not be stored in our database in our case
                database.create(req.body,function(err,user){
                    if(err){
                        console.log('error in signing -up');
                    }
                    else{
                        if(req.file){
                            user.avatar=database.avatarPath + '/' + req.file.filename;
                        }
                        user.save();
                        return res.redirect('/users/signin');
                    }

                });
            }else{
                return res.redirect('back');
            }
    
        })


    });

}
module.exports.createSession=function(req,res){
    //we are setting the flash messages which are to be displayed in the view when a user logs in or logs out..
    //but the catch here is that we are setting the key value for flash message in req object but the views
    //only have the access of res.locals so we need to transfer these key value pairs into the res.locals
    //so we have created another middleware in config which will done this task..just like the case when 
    //we signed in but the authentication was only present as req.user (where .user was actually included by
    //passportjs in the req object) so we had made an middleware 'setAuthentication' to transfer user's authenticated
    //info into the res.locals
    req.flash('success','logged in successfully');
    return res.redirect('/');
}
module.exports.destroySession=function(req,res){
    req.logout();
    req.flash('success','logout sucessfully!')
    return res.redirect('/');
}

// module.exports.update=function(req,res){





// //if the profile page belongs to the current signed in user then only we have to give access for updating the info
// //pertaining to current profile page..
// //we are putting this check as if the user changed the id his id with another ones from the inspect tool then without
// //this condition that user will be able to change the info of another user


//     if(req.params.id==req.user.id){
//         database.findByIdAndUpdate(req.params.id,req.body,function(err,user){

//             return res.redirect('back');
    
//         });
//     }else{
//         return res.status(401).send('Unauthorized');
//     }
// }

module.exports.updateProfilePage=function(req,res){

    return res.render('update_profile',{layout:'update_profile'});



}



module.exports.update = async function(req,res){

    

        // let user= await findByIdAndUpdate({name:req.body.name,email:req.body.email});

    try{
        let user=await database.findById(req.user.id);

        database.uploadedAvatar(req,res,function(err){
            if(err){console.log("***multer error***: ",err);}
            

            //req.body could'nt be accesible without using multer as the form is multipart type of form(see profilr.ejs)
            if(req.user.id==req.body.userid){

                user.name=req.body.name;
                user.email=req.body.email;
                user.bio=req.body.bio;
                if(req.file){
    
                    if(user.avatar && fs.existsSync(__dirname+'/..'+user.avatar)){
                        fs.unlinkSync(path.join(__dirname+'/..'+user.avatar));
                    }
    
                    user.avatar=database.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect(`/users/profile/${req.user.id}`);

            }else{
                return res.status(401).send('Unauthorized');
            }

        });


    }catch(err){
        req.flash('error',"updation error");
        console.log('catch error',err);
        return res.redirect('back');
    }


}

// this function renders a page where user enters their email associated with forgotten password account
module.exports.enterMail=function(req,res){
    return res.render('forgot-password',{});
}

// here we are checking whether the given email exists or not and if it exists then we are sending the mail
// containing th link with a randomly generated token..we will save that token in our database as the object
// which will also contain userid and validity of the token(which will get expired as soon as the password gets updated)
module.exports.verifyMail=async function(req,res){

    let user= await database.findOne({email:req.body.email});

    if(!user){
        return res.redirect('back');
    }
    let token=crypyo.randomBytes(20).toString('hex');

    let tokenLink="http://localhost:8000/users/forgot-password/update-password-page/"+token;
    console.log(tokenLink);
    let data={
        tokenLink:tokenLink,
        user:user
    }
    UpdatePasswordTokenMailer.accessToken(data);

    accessTokenModel.create({
        accessToken:token,
        user:user._id,
        isValid:true
    });

    return res.render('waitforToken');
}
// this action will load the password update page but only when the user clicks the link from their mail message
// consisting of a non expired token
module.exports.PasswordUpdatePage=async function(req,res){
// we will check that the url contains the token which is present in our db or not
    let tokenData=await accessTokenModel.findOne({accessToken:req.params.id});

    if(tokenData && tokenData.isValid){
        return res.render('password_update_page',{token:tokenData.accessToken});
    }else{
        return res.render('expired_link');
    }
}


// this action updates password of the user but only when the passo=word and cnf_password will be same and the token
// provided by user is valid..after updating the password we will update the value of 'is_valid' of accessToken object
// as false 
module.exports.passwordUpdate=async function(req,res){

    let tokenData=await accessTokenModel.findOne({accessToken:req.params.id});
    console.log('req.params.id: ',req.params.id);
    if((req.body.password==req.body.confirm_password) && tokenData && tokenData.isValid){
        await database.findByIdAndUpdate(tokenData.user,{password:req.body.password});
        console.log('tokenData.user :',tokenData.user);
        await accessTokenModel.findOneAndUpdate({accessToken:req.params.id},{isValid:false});
    }
    return res.redirect('/users/signin');
}