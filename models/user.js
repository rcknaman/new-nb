const mongoose=require('mongoose');
const multer=require('multer');

const path=require('path');
//we have settled the assets to '__dirname+/uploads' whenever req will be '/upload' and after that the AVATAR_PATH
//will save the path for avatar
const AVATAR_PATH=path.join('/uploads/users/avatars');

//path.join joins strings using '/ in between
const userSchema=new mongoose.Schema({

    email: {
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    //database will not store the file in our case thats an image file ..it will only store the path where the file will
    //exist
    avatar: { 
        type:String
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    }],
    chatroom:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chatroom'
    }],
    friendRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    }],
    sendedRequest:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    }],
    reqAcceptedNotif:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userschema'
    }]

},{
    timestamps:true
})


//from multer documentation to set the desttination and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //destination tells  us that where to store the uploaded files
        // here __dirname + /.. == current folder(models)
      cb(null, path.join(__dirname,'/..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      //file.fieldname is the key name of file whose value is file itself
      cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname));
      console.log(file.fieldname);
    }
});

//static functions(functions of the class which are publicly avaliable)

//this will connect multer with the database and stores the file info
userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');

//this function will give access to the path address where our avatar files will be saved
userSchema.statics.avatarPath=AVATAR_PATH;



const data = mongoose.model('userschema',userSchema);
module.exports=data;