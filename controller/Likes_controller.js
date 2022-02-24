const Like=require('../models/likes_model');

const Post=require('../models/post');
const Comments=require('../models/comments_model');

module.exports.toggleLike=async function(req,res){

// http://localhost:8000/likes/toggle/?likeableId=xyz&type=Post&reaction=namaste

    try {
        let likeable;
        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.likeableId);
        }
        else{
            likeable=await Comments.findById(req.query.likeableId);
        }
        let reaction=req.query.reaction;
        let like=await Like.findOne({
            Likeable:likeable._id,
            onModel:req.query.type,
            user:req.user._id
        });
        if(reaction=='unlike'){
            if(like){
                likeable.likes.pull(like._id);
                likeable.save();
                like.remove();

            }
        }else{
            if(like){
                // update
                console.log('like exist already');
                like.reaction=reaction;
                like.save();
            }else{
                // create new
                let newlike=await Like.create({
                    Likeable:likeable,
                    onModel:req.query.type,
                    user:req.user._id,
                    reaction:reaction
                });
                likeable.likes.push(newlike._id);
                likeable.save();
            }

        }
        if(req.xhr){

            return res.json(200,{

                message:'request successful',
                data:{

                    type:req.query.type,
                    likeableId:req.query.likeableId,
                    likescount:likeable.likes.length
                }
            })
        }
    } catch (error) {
        console.log(error);
        return res.json(500,{
            message:'internal server error'
        })
        
    }
}
