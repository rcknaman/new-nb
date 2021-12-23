const Comment=require('../models/comments_model');
const posts=require('../models/post');

module.exports.comment=function(req,res){
    posts.findById(req.body.postid,function(err,post){

        console.log(req.body.postid);
        console.log(post);
        if(post){
            Comment.create({
                content:req.body.comment,
                post:req.body.postid,
                user:req.user._id
                

            },function(err,comment){
                console.log(comment);
                post.comments.push(comment);
                post.save();
                res.redirect('/');
            });
        }
    });
}

