const express=require('express');
const router=express.Router();
let groupsController=require('../controller/groupsController');
// const passport=require('passport');


router.post('/create',groupsController.createGroup);
router.get('/info/:groupId',groupsController.groupInfo);
router.get('/createGroupPage',groupsController.createGroupPage);
router.get('/allUsers',groupsController.allUsers);
router.post('/update/:groupId',groupsController.update);
module.exports=router;