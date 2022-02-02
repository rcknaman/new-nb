const express=require('express');
const router=express.Router();
const passport = require('passport');
const postcontroller=require('../controller/post_controller');
router.post('/create',passport.checkAuthentication,postcontroller.posts);
//req.params type link
router.get('/destroy/:id',passport.checkAuthentication,postcontroller.destroy);

module.exports=router;