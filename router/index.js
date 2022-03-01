const express=require('express');

const router=express.Router();
const homecontroller=require('../controller/home_controller');
router.get('/',homecontroller.home);
router.use('/users',require('./users'));
router.use('/posts',require('./postrouter'));
router.use('/comment',require('./commentrouter'));
router.use('/likes',require('./likes_router'));
router.use('/api',require('./api/api_route_index'));
router.use('/message',require('./messageRouter'));
router.use('/groups',require('./groups'));
console.log('router loaded');
module.exports=router;
