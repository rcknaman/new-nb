const Comment=require('../models/comments_model');
const posts=require('../models/post');
const Likes=require('../models/likes_model');
const commentMailer=require('../mailer/comment-mailer');


const queue=require('../config/kue');
const emailWorker=require('../workers/comment_email_worker');
module.exports.comment= async function(req,res){

    try {
        let post=await posts.findById(req.body.postid);

        if(post){
            let comment=await Comment.create({
                content:req.body.comment,
                post:req.body.postid,
                user:req.user._id
        
            });
            post.comments.push(comment);
            post.save();
            comment =await comment.populate('user','name email');
            // commentMailer.newComment(comment);


            // created a job and entering it inside the job queue of name 'emails'..if that queue isn'nt existing
            //or it is empty in that case it will be created internally when we assign a job to it!
            // each queue must have a worker which will execute the jobs present in the queue
            // if there are several queues,then the preference will be  given to them according to their priorrity..
            // and for each queue there will be some threshold time so that if any queue will take unusaual time
            // then it will be paused for next iteration and next queue will get executed..and so on in 'round robin fashion'
            let job=queue.create('emails',comment).save(function(err){
                if(err){
                    console.log(err);
                    return;
                }
                return;
            });

            if(req.xhr){
                return res.status(200).json({

                    data:{
                        //we are sending this to the front_java so we need not to create the 
                        // req.flash('success','blah') so we commented it below
                        flash:"comment created",
                        comment:comment,
                        username:req.user.name

                    },
                    message:"comment created successfully"
                });
            }else{
                return res.redirect('/');
            }
        }

    } catch (error) {
        console.log('errror in comment creation',error);
    }
    // req.flash('success','comment created');
}
//in order to delete the comments first of all we have to remenove it's reference(id) from its parent post because
//it has stored array of comment ids pertaining to itself
module.exports.destroy=function(req,res){
//-----------------------------------------------------------------
    // Comment.findById(req.params.id,function(err,comment){

    //     if(comment && (req.user.id==comment.user || req.user.id==comment.post){
    //         let postId=comment.post;
    //         comment.remove();

    //         posts.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}},function(err,post){
    //             return res.redirect('back');
    //         });
            
    //     }else{
    //         return res.redirect('back');
    //     }


    // });
//---------------------------------------------------------------------
    Comment.findById(req.params.id)
    .populate('post')
    .exec(function(err,comment){
        //either the author of the post or the author of the comment can delete the comment on the post
        if(comment && (req.user.id==comment.user || req.user.id==comment.post.user)){
            let postId=comment.post;
            let commentId=comment._id;
            comment.remove();

            posts.findByIdAndUpdate(postId,{ $pull:{comments:req.params.id}},function(err,post){
                Likes.deleteMany({Likeable:req.params.id,onModel:'Comment'},function(){
                    if(req.xhr){
                        return res.status(200).json({
    
                            data:{
    
                                commentId:commentId,
                                flash: 'comment-deleted'
    
                            },
                            message:"comment deleted"
    
                        });
                    }
                });

            });
            req.flash('success','comment deleted successfully');
            
        }else{
            console.log('nhi hua delete');
            return res.redirect('back');
        }
    });




}