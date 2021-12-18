const express=require('express');

const router=express.Router();

const homecontroller=require('../controller/home_controller');
router.get('/',homecontroller.home);
router.use('/users',require('./users'));
console.log('router loaded');
module.exports=router;
