const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
let GroupPicPath=path.join('/uploads/groups/groupPic');
let group=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema',
        required:true
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    }],
    groupPic:{
        type:String
    },
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'GroupMsg'
    }]


});

const storage=multer.diskStorage({

    destination:function(req,file,cb){
        cb(null, path.join(__dirname,'/..',GroupPicPath));
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        //file.fieldname is the key name of file whose value is file itself
        cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname));
    }



});

group.statics.groupPic=multer({storage:storage}).single('groupPic');
group.statics.GroupPicPath=GroupPicPath;


const groups=mongoose.model('groups',group);
module.exports=groups; 