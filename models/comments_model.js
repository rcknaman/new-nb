const mongoose=require('mongoose');

const comment_schema=new mongoose.Schema({
    
    content:{
        type:String,
        required:true
    },

    //one comment belong to one user(who is posting that comment('not the post's author')) so comment
    // and user is one-to-one relationship so we are storing the id of the user who is posting this
    //comment(ofcource that user will be present on the user database who is posting the comment as
    // user must signin before making any sort of comment)
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    },
    //one comment can only belong to one post 
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Likes'
    }]
    
},{
    timestamps:true
});
const comment=mongoose.model('Comment',comment_schema);
module.exports=comment;