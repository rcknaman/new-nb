const express=require('express');
const router=express.Router();

const passport=require('passport');


const usercontroller=require('../controller/user_controller');

router.get('/profile',passport.checkAuthentication,usercontroller.profile);
router.get('/signin',usercontroller.signin);
router.get('/signup',usercontroller.signup);
router.post('/create',usercontroller.create);

router.post('/create-session',passport.authenticate(
        'local',
        {failureRedirect:'/users/signin'}
),usercontroller.createSession);

router.get('/signout',usercontroller.destroySession);

module.exports=router;  
