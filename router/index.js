const express=require('express');

const router=express.Router();

const homecontroller=require('../controller/home_controller');
router.get('/',homecontroller.home);
router.use('/users',require('./users'));
router.use('/posts',require('./postrouter'));
router.use('/comment',require('./commentrouter'));
console.log('router loaded');
module.exports=router;
