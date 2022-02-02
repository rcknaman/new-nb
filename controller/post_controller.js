const Post=require('../models/post');
const Comments=require('../models/comments_model');
const Likes=require('../models/likes_model');
console.log('hello!');
module.exports.posts=async function(req,res){

        //put res.redirect('back) inside callback function otherwise the req.flash don't work and some other
        //wierd things will happen
    try{
        //here we have to use async await syntax if we want to put data of Post.create into some variable..
        //we can't do assign its value if we will be using nested functions 
        let post= await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post:post,
                    flash: "post created successfully",
                    username: req.user.name
                },
                message: "post created"
            });
            
        }
        // req.flash('success','post created successfully');
        return res.redirect('back');


    }catch(err){
        console.log('post: ');
        req.flash('error','error in creating post');
        return res.redirect('back');
    }
}

module.exports.destroy=async function(req,res){


    try {
        let post=await Post.findById(req.params.id);
            //here we are checking that only the person who is author of the post is authorized to delete this post
            //so if the current logged in user is not the author of the post then his request of deleting current post
            //will not be fullfilled by our controller
    
        if(post.user==req.user.id){
            // finding all comments assocaited with the post to delete comment's likes from Likes db
            // deleting the likes assciaed with each comment
            // here $in is used as an 'or' and the rhs(comments) will be an array or the query object i.e. 
            // $in will perform the 'delete query' on all like documents which are present in the comments variable
            // from Like db
            // it will automatically fetch all the like  ids associated with the comments
            await Likes.deleteMany({$in:post.comments});
            // deleting associated comments
            await Comments.deleteMany({post:req.params.id});
            // deleting associated likes of the post
            await Likes.deleteMany({Likeable:req.params.id,onModel:'Post'});
                // req.flash('success','post and associate comments deleted successfully');
            post.remove();
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id,
                        flash:"post deleted"
                    },
                    message:"post deleted"
                });
            }else{
                return res.redirect('back');
            }
            
        }else{
            req.flash('error','cannot delete the post');
            res.redirect('back');
        }
    } catch (err) {
        return res.json(500,{
            message:'Internal Server Error!'
        });
    }



}

