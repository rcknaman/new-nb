const express=require('express');
const router=express.Router();
let friend_controller=require('../controller/friend_controller');
router.post('/toggle/:id',friend_controller.toggle_friend);
router.get('/reject_req/:id',friend_controller.reject);
router.get('/remove-friend/:removedTo/:removedBy',friend_controller.destroy);

module.exports=router;