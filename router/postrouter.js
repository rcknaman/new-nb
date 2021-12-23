const express=require('express');
const router=express.Router();
const passport = require('passport');
const postcontroller=require('../controller/post_controller');
router.post('/create',passport.checkAuthentication,postcontroller.posts);
module.exports=router;