const express = require('express');
const router=express.Router();
const user_controller=require('../controller/user_controller');
router.get('/enter-mail',user_controller.enterMail);
router.post('/verify-mail',user_controller.verifyMail);
router.get('/update-password-page/:id',user_controller.PasswordUpdatePage);
router.post('/update-password/:id',user_controller.passwordUpdate);
module.exports=router;