const mongoose=require('mongoose');

let chatroom=new mongoose.Schema({

    name:{
        type:String
    },
    messageId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]


},{
    timestamps:true
});
let Chatroom=mongoose.model('Chatroom',chatroom);
module.exports=Chatroom;