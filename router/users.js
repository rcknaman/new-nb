const express=require('express');
const router=express.Router();

const usercontroller=require('../controller/user_controller');

router.get('/profile',usercontroller.profile);
router.get('/signin',usercontroller.signin);
router.get('/signup',usercontroller.signup);
router.post('/create',usercontroller.create);
module.exports=router;  
