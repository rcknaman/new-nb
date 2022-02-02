const posts = require('../models/post');
const User=require('../models/user');
const Chatroom=require('../models/chatRoom');
module.exports.home = async function (req, res) {

    //this piece of code will not work if we want to display the author of the posts as well along with
    // their posts because we have saved the user id with their corresponding posts in the database
    //so we need to first fetch the name of the author with the help of their user id .



    // posts.find({},function(err,post_data){
    //     if(err){
    //         console.log('error in home-controller');
    //         return err;
    //     }
    //     return res.render('home',{
    //         title:'Codial',
    //         posts:post_data
    //     });
    // });

    //so the syntax will slightly change inorder to pre populate the details of the user

    //here the 'user' is from the post schema which stores the id of every user..so in the argument
    //of populate we put that entity on the basis of which we could find the details of the user
    let post_data=await posts.find({})
        .populate('user')
        .sort('-createdAt')
        //here this is another syntax via which we can populate the array..if we are given
        //an array of ids..we dont need to specify the model from where they should fetch
        //and populate the array as in their schema there is already mentioned the 'ref' attribute
        //which signifies the reference of the selescted array id's
        .populate({
            path: 'comments',
            populate: {
                path:'user likes'
            }
        })  
        .populate({
            path:'likes',
            select:'user reaction'
        })
        if(req.user){
            await req.user.populate({path:'friends'});
        }
    let user=await User.find({})
    let myProfile;
    if(req.user){
        myProfile=await User.findById(req.user._id)
        .populate({
            path:'chatroom',
            populate:{
                path:'messageId'
            }
        });
       
    }

    return res.render('new_home', {
        title: 'Codial',
        posts: post_data,
        all_users:user,
        userFriends:req.user,
        myProfile:myProfile
    });
}


