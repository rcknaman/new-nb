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






// module.exports.toggleLike=async function(req,res){
//     // request url when the like button will be pressed
//     //  /likes/toggle/?likeableId="dds"&type="something"

//     try {
//         let likeable;
//         let deleted;


//         if(req.query.type=='Post'){
//             likeable=await Post.findById(req.query.likeableId);
//         }
//         else{
//             likeable=await Comments.findById(req.query.likeableId);
//         }
//         // checking that the likeable is already liked or not
//         let alreadyLiked=await Like.findOne({
//             Likeable:req.query.likeableId,
//             onModel:req.query.type,
//             user:req.user._id
//         });
//         // deleted = true mean that the likeable was liked before pressing like button and after pressing the like
//         // must be deleted now from the likeable(as the user is unliking the likeable)
//         if(alreadyLiked){
//             likeable.likes.pull(alreadyLiked);
//             likeable.save();
//             alreadyLiked.remove();
//             deleted=true;
//         }
//         // deleted = false mean that the likeable was not liked before pressing like button and after pressing the like
//         // must be added now from the likeable(as the user is liking the likeable)
//         else{

//             let newLike=await Like.create({
//                 Likeable:req.query.likeableId,
//                 onModel:req.query.type,
//                 user:req.user._id
//             });
//             likeable.likes.push(newLike);
//             likeable.save();
//             deleted=false;
//         }
//         if(req.xhr){
//             return res.json(200,{
//                 message:'request successful',
//                 data:{
//                     deleted:deleted,
//                     type:req.query.type,
//                     likeableId:req.query.likeableId
//                 }
//             });
//         }

//     } catch (err) {
//         console.log(err);
//         return res.json(500,{
//             message:'internal server error'
//         });
//     }


// }