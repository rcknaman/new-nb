const mongoose=require('mongoose');

const multer=require('multer');
const path=require('path');


let post_path_video=path.join('/uploads/posts/video');
let post_path_photo=path.join('/uploads/posts/photo');
let post_path_audio=path.join('/uploads/posts/audio');



const postSchema=new mongoose.Schema({

    content:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'userschema'
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Likes'
    }],
    audio:[{
        type:String
    }],
    video:[{
        type:String
    }],
    image:[{
        type:String
    }]
},{
    timestamps:true
});
let audioArray=['audio/aac','audio/midi','audio/x-midi','audio/ogg','audio/mpeg','audio/opus','audio/wav','audio/webm','audio/3gpp','audio/3gpp2'];
let videoArray=['video/x-msvideo','video/mp4','video/mpeg','video/ogg','video/mp2t','video/webm','video/3gpp','video/3gpp2'];
let photoArray=['image/avif','image/bmp','image/gif','image/vnd.microsoft.icon','image/jpeg','image/png','image/svg+xml','image/tiff','image/webp'];

const file_storage=multer.diskStorage({

    destination:function(req,file,cb){
        console.log('file.mimetype: ',file.mimetype);
        console.log('audioArray.includes(file.mimetype): ',audioArray.includes(file.mimetype));
        if(videoArray.includes(file.mimetype)){
            cb(null,path.join(__dirname,'/..',post_path_video));
        }
        
        else if(audioArray.includes(file.mimetype)){
            cb(null,path.join(__dirname,'/..',post_path_audio));
        }
        else if(photoArray.includes(file.mimetype)){
            cb(null,path.join(__dirname,'/..',post_path_photo));
        }
    },
    filename:function(req,file,cb){

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        if(videoArray.includes(file.mimetype)){
            cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname));
        }
        else if(audioArray.includes(file.mimetype)){
            cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname));
        }
        else if(photoArray.includes(file.mimetype)){
            cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname));
        }

    }


});


postSchema.statics.fileStorage=multer({storage:file_storage});

postSchema.statics.photoPath=post_path_photo;
postSchema.statics.videoPath=post_path_video;
postSchema.statics.audioPath=post_path_audio;


const post=mongoose.model('Post',postSchema);
module.exports=post;