const Post=require('../models/post');
module.exports.posts=function(req,res){

    Post.create({

        content:req.body.content,
        user:req.user._id

    },function(err,user){
        if(err){
            console.log('error in post creation');
            return res.redirect('back');
        }
    });
    console.log("id: ",typeof(req.user.id)," ","_id: ",typeof(req.user._id));
    return res.redirect('back')
}