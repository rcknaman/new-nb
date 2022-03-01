const Groups=require('../models/group');
const groupMsg=require('../models/groupMsg');
const Users=require('../models/user');
const fs=require('fs');
const path=require('path');
module.exports.createGroup=function(req,res){

    Groups.groupPic(req,res,function(err){




        Groups.create({

            name:req.body.groupName,
            description:req.body.groupDesc,
            admin:req.body.admin,
            users:req.body.groupMembers
        },function(err,group){


            if(err){
                console.log(err);
            }
            if(req.file){

                group.groupPic=Groups.GroupPicPath+'/'+req.file.filename;
                group.save();
                
            }

            return res.redirect('/');


        });
    });
    
}

module.exports.groupInfo=async function(req,res){

    let group=await Groups.findById(req.params.groupId)
    .populate({
        path:'users',
        select:'name'
    }).populate({
        path:'admin',
        select:'name'
    });

    let restUsers=await Users.find({_id:{$nin:group.users.concat([group.admin])}});

    console.log('restUsers',restUsers);

    return res.json(200,{

        data:{

            group:group,
            restUsers:restUsers
        }

    });


}
module.exports.createGroupPage=async function(req,res){
    let users=await Users.find({_id:{$nin:[req.user._id]}});
    return res.render('creategroup',{layout:'creategroup',users:users});
}
module.exports.allUsers=async function(req,res){
    let allUsers=await Users.find({});
    return res.json(200,{
        allUsers:allUsers
    });
}
module.exports.update=async function(req,res){

    Groups.groupPic(req,res,function(err){

        console.log(req.body);

        Groups.findByIdAndUpdate(req.params.groupId,{

            name:req.body.groupName,
            description:req.body.groupDesc,
            admin:req.body.admin,
            users:req.body.groupMembers

        },function(err,group){

            if(req.file){


                if(group.groupPic && fs.existsSync(__dirname+'/..'+group.groupPic)){
                    fs.unlinkSync(path.join(__dirname+'/..'+group.groupPic));
                }
                group.groupPic=Groups.GroupPicPath+'/'+req.file.filename;
                group.save();
            }
            return res.redirect('/')

        })
    });


}