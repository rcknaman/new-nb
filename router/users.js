const express=require('express');
const router=express.Router();

const passport=require('passport');


const usercontroller=require('../controller/user_controller');

router.get('/profile/:id',passport.checkAuthentication,usercontroller.profile);
router.get('/signin',usercontroller.signin);
router.get('/signup',usercontroller.signup);
router.post('/create',usercontroller.create);
router.post('/update/:id',usercontroller.update);
router.post('/create-session',passport.authenticate(
        'local',
        {failureRedirect:'/users/signin'}
),usercontroller.createSession);
router.use('/friends',require('./friends_router'));
router.get('/signout',usercontroller.destroySession);
router.use('/forgot-password',require('./forgot_password'));
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin'}),usercontroller.createSession);
module.exports=router;  
