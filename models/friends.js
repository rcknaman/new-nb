const mongoose=require('mongoose');

let friends= new mongoose.Schema({

    requestBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    },
    requestTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    }


});
const Friends=mongoose.model('Friends',friends);
module.exports=Friends;