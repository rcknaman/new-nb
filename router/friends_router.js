const express=require('express');
const router=express.Router();
let friend_controller=require('../controller/friend_controller');
router.post('/toggle/:id',friend_controller.toggle_friend);
router.get('/reject_req/:id',friend_controller.reject);
router.get('/delete/:id',friend_controller.destroy);

console.log(friend_controller.destroy);
module.exports=router;