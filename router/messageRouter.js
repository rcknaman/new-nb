const express=require('express');
const router=express.Router();
const message_controller=require('../controller/messageController');
const passport=require('passport');

router.get('/messagepage/:friendId',passport.checkAuthentication,message_controller.messagepage);

router.post('/create',passport.checkAuthentication,message_controller.createMessage);
router.post('/seen/:messageId',message_controller.seen);
router.get('/loadMessage/:friendId',passport.checkAuthentication,message_controller.loadMessage);
module.exports=router;