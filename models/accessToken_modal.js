const mongoose=require('mongoose');

const TokenSchema=new mongoose.Schema({

    accessToken:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    },
    isValid:{
        type:Boolean
    }
},
{
    timestamps:true
});

const Token=mongoose.model('Token',TokenSchema);
module.exports=Token;