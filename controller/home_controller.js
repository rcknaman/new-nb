const posts = require('../models/post');



module.exports.home = function (req, res) {

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
    posts.find({})
        .populate('user')
        //here this is another syntax via which we can populate the array..if we are given
        //an array of ids..we dont need to specify the model from where they should fetch
        //and populate the array as in their schema there is already mentioned the 'ref' attribute
        //which signifies the reference of the selescted array id's
        .populate({
            path: 'comments',
            populate: {
                path:'user'
            }
        })
        .exec(function (err, post_data) {
            if (err) {
                console.log('error in home-controller');
                return err;
            }
            return res.render('home', {
                title: 'Codial',
                posts: post_data
            });
        })


}


