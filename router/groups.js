const express=require('express');
const router=express.Router();
let groupsController=require('../controller/groupsController');
// const passport=require('passport');


router.post('/create',groupsController.createGroup);
router.get('/info/:groupId',groupsController.groupInfo);
router.get('/createGroupPage',groupsController.createGroupPage);
router.get('/allUsers',groupsController.allUsers);
router.post('/update/:groupId',groupsController.update);
router.get('/groupinfopage/:groupId',groupsController.groupinfoPage);
router.get('/groupUpdatePage/:groupId',groupsController.groupupdatepage);
router.get('/loadMessage/:groupId',groupsController.loadmessage);
router.post('/Createmessage',groupsController.createMsg);
router.post('/seenMessage/:msgId',groupsController.msgSeen);
router.get('/groupchatpage/:groupId',groupsController.groupchatpage);
module.exports=router;