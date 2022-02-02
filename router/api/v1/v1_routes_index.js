const express=require('express');

const router=express.Router();


router.use('/posts',require('./post_v1_router'));

router.use('/users',require('./user_v1_router'));
module.exports=router;

