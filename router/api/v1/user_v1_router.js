const express=require('express');

const router=express.Router();
const user_api_ctrl=require('../../../controller/api/v1/user_v1_ctrl');
router.use('/create-session',user_api_ctrl.createSession);
module.exports=router;
