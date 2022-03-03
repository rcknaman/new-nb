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
    },
    seen:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    }]
},{
    timestamps:true
});

let Message=mongoose.model('GroupMsg',message);
module.exports=Message;