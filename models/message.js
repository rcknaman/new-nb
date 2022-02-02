const mongoose=require('mongoose');

let message=new mongoose.Schema({

    message:{
        type:String
    },
    sentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    },
    chatroom:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chatroom'
    }
},{
    timestamps:true
});

let Message=mongoose.model('Message',message);
module.exports=Message;