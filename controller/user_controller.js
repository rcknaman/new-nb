const database=require('../models/user');

const path=require('path');
const fs=require('fs');
const Friends=require('../models/friends');
const crypyo=require('crypto');
const UpdatePasswordTokenMailer=require('../mailer/update_password_link');

const accessTokenModel=require('../models/accessToken_modal');
module.exports.profile=async function(req,res){


    let friendship=await Friends.findOne({requestBy:{$in:[req.params.id,req.user.id]},requestTo:{$in:[req.params.id,req.user.id]}});

    let user = await database.findById(req.params.id);
    return res.render('profile',{
        title:'codial|profile page',
        user_profile:user,
        friendship:friendship
    });


}
module.exports.signin=function(req,res){
    //if the user is already signed in on his system then he must get redirected to his profile page 
    //in place of signin page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('usersignin',{
        title:'codial|signin',
        
    });
}

module.exports.signup=function(req,res){
    //if the user is already signed in on his system then he must get redirected to his profile page 
    //in place of signup page
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('usersignup',{
        title: 'codial|signup'
    })
}
module.exports.create=function(req,res){
    database.findOne({'email': req.body.email}, function(err,user){
        if(err){
            console.log('error in finding the user in signing up');
            console.log('error h bc');
            return res.redirect('back');
        }
        console.log(!user);
        if(!user){
            //here req.body is the data which we are saving and only that data is saved which is 
            //present in schema i.e. confirm password will not be stored in our database in our case
            database.create(req.body,function(err,user){
                if(err){
                    console.log('error in signing -up');
                }
                return res.redirect('/users/signin');
            })
            console.log('no user');
        }else{
            console.log('wtf');
            return res.redirect('back');
        }

    })



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

module.exports.update = async function(req,res){

    

    if(req.params.id==req.user.id){
        // let user= await findByIdAndUpdate({name:req.body.name,email:req.body.email});

        try{
            let user=await database.findById(req.params.id);

            database.uploadedAvatar(req,res,function(err){
                if(err){console.log("***multer error***: ",err);}
                

                //req.body could'nt be accesible without using multer as the form is multipart type of form(see profilr.ejs)

                user.name=req.body.name;
                user.email=req.body.email;

                if(req.file){

                    if(user.avatar && fs.existsSync(__dirname+'/..'+user.avatar)){
                        fs.unlinkSync(path.join(__dirname+'/..'+user.avatar));
                    }

                    user.avatar=database.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });


        }catch(err){
            req.flash('error',"updation error");
            console.log('catch error',err);
            return res.redirect('back');
        }

    }else{
        req.flash('error','Unauthorized')
        return res.status(401).send('Unauthorized');
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