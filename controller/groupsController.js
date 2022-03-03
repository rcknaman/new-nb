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
        console.log('req.body.groupMembers',req.body.groupMembers);
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
module.exports.groupupdatepage=async function(req,res){

    try {
        
        let group=await Groups.findById(req.params.groupId)
        .populate({
            path:'users',
            select:'name'
        }).populate({
            path:'admin',
            select:'name'
        });
        let restUsers=await Users.find({_id:{$nin:group.users.concat([group.admin])}});
    
        return res.render('updategroup',{layout:'updategroup',group:group,restUsers:restUsers});


    } catch (error) {
        console.log('catch: ',error);
    }



}
module.exports.groupinfoPage=async function(req,res){
    try {
        
        let group=await Groups.findById(req.params.groupId)
        .populate({
            path:'users',
            select:'name'
        }).populate({
            path:'admin',
            select:'name'
        });
    
        return res.render('groupinfo',{layout:'groupinfo',group:group});


    } catch (error) {
        console.log('catch: ',error);
    }
    
}
module.exports.loadmessage=async function(req,res){

    let group=await Groups.findById(req.params.groupId)
    .populate({
        path:'messages',
        populate:{
            path:'sentBy',
            select:'name'
        }
    });

    if(group){

        let GroupArrayLength=group.messages.length;
        for(let i=GroupArrayLength-1;i>=0;i--){
    
            if(group.messages[i].seen.includes(req.user._id)){
                break;
            }else{
                await groupMsg.findByIdAndUpdate(group.messages[i],{$push:{'seen':req.user._id}});
            }
    
        }



        return res.json(200,{
            data:{
                messages:group.messages,
                isValid:true
            }
        })


    }else{
        
        return res.json(200,{
            data:{
                isValid:false
            }
            
        });
    }


}
module.exports.createMsg=async function(req,res){

    let message=await groupMsg.create({
        message:req.body.message,
        sentBy:req.user.id,

    });


    let group=await Groups.findByIdAndUpdate(req.body.groupId,{$push:{messages:message.id}});

    if(group){

        return res.json(200,{
            data:{
                message:message.message,
                groupId:req.body.groupId,
                sentBy:req.user.id,
                messageId:message.id,
                valid:true,
                members:group.users.concat([group.admin])
            }

        });
    }else{

        return res.json(200,{
            data:{
                valid:false
            }
        })

    }

}
module.exports.msgSeen=async function(req,res){

    let message=await groupMsg.findByIdAndUpdate(req.params.msgId,{$addToSet:{seen:req.user.id}});

    return res.json(200,{
        message:'seen'
    })
}
module.exports.groupchatpage=async function(req,res){

    let group=await Groups.findById(req.params.groupId,{messages:1,name:1})
    .populate({
        path:'messages',
        populate:{
            path:'sentBy',
            select:'name'

        }
    });

    if(group){

        let GroupArrayLength=group.messages.length;
        for(let i=GroupArrayLength-1;i>=0;i--){
    
            if(group.messages[i].seen.includes(req.user._id)){
                break;
            }else{
                await groupMsg.findByIdAndUpdate(group.messages[i],{$push:{'seen':req.user._id}});
            }
    
        }



        return res.render('groupchatpage',{
            layout:'groupchatpage',
            messages:group.messages,
            groupId:group.id,
            groupname:group.name
        });


        }else{
            return res.redirect('back');
        }

}