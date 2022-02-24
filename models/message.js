const mongoose=require('mongoose');

let message=new mongoose.Schema({

    message:{
        type:String
    },
    sentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    },
    type:{
        type:String
    },
    chatroom:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chatroom'
    },
    seen:{
        type:String,
        default:'false'
    }
},{
    timestamps:true
});

let Message=mongoose.model('Message',message);
module.exports=Message;