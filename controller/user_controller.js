const database=require('../models/user');



module.exports.profile=function(req,res){
    // console.log(req.body);
    // console.log(res.locals);
    return res.render('profile',{
        title:'codial|profile page'
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
    return res.redirect('/');
}
module.exports.destroySession=function(req,res){
    req.logout();
    return res.redirect('/');
}