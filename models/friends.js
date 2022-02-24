const mongoose=require('mongoose');

let friends= new mongoose.Schema({

    requestBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    },
    requestTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    },
    messageId:[{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'

    }]


});
const Friends=mongoose.model('Friends',friends);
module.exports=Friends;