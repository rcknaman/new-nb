const mongoose=require('mongoose');


// difference bw ref and refPath is that refPath value is dynamic in nature but ref having fixed value
let likes=new mongoose.Schema({

    Likeable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'onModel'
    },
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    reaction:{
        type:String,
        required:true
    }
},
{
    timestamps:true

});

let Likes=mongoose.model('Likes',likes);

module.exports=Likes;