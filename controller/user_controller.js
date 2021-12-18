const database=require('../models/user');



module.exports.profile=function(req,res){
    res.end('<h1>dddddd</h1>');
}
module.exports.signin=function(req,res){
    return res.render('usersignin',{
        title:'codial|signin'
    });
}

module.exports.signup=function(req,res){
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

}