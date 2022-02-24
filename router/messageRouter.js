const express=require('express');
const router=express.Router();
const message_controller=require('../controller/messageController');

router.post('/create',message_controller.createMessage);
router.post('/seen/:messageId',message_controller.seen);
router.get('/loadMessage/:friendId',message_controller.loadMessage);
module.exports=router;