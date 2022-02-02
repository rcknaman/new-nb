const express=require('express');

const router=express.Router();
const passport=require('passport');

const postApi=require('../../../controller/api/v1/post_v1_ctrl');

//putting the authentication check before deleting the post
router.get('/',postApi.index);
router.delete('/:id',passport.authenticate(
    'jwt',
    {session:false}),postApi.destroy);
module.exports=router;