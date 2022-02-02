const posts=require('../../../models/post');

const Comment=require('../../../models/comments_model');

module.exports.index= async function(req,res){

    let post_data= await posts.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        }
        
    });
    return res.json(200,{
        message:"lists of posts",
        posts:post_data
    });

}

//just like we had creatd the action for deleting the post from the database using locals..same here we are doing 
//it for the api side using jwt
module.exports.destroy = async function(req, res){

    try{
        let post = await posts.findById(req.params.id);

        if (post.user == req.user.id){//authenticating user
            post.remove();

            await Comment.deleteMany({post: req.params.id});

            return res.json(200,{
                message:'post deleted successfully!'//inplace of redirecting back here we are sending some json response
            });
        }else{
            return res.json(402,{
                message:"not allowed to delete this post"
            });
        }
    }
    catch(err){
        return res.json(500,{
            message:"error in deletion"
        })
    }
    
}