const express=require('express');
const router=express();

const usercontroller=require('../controller/user_controller');

router.get('/profile',usercontroller.profile);

module.exports=router;  
