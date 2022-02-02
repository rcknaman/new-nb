const mongoose=require('mongoose');

let friends= new mongoose.Schema({

    requestBy:{
        type:mongoose.Schema.Types.ObjectId
    },
    requestTo:{
        type:mongoose.Schema.Types.ObjectId
    }


});
const Friends=mongoose.model('Friends',friends);
module.exports=Friends;