const express=require('express');
const router=express.Router();
const passport=require('passport');
const commentcontroller=require('../controller/comment_controller');
router.use('/create',passport.checkAuthentication,commentcontroller.comment);
module.exports=router;