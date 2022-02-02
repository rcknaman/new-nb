const express=require('express');

const router=express.Router();

router.use('/v1',require('./v1/v1_routes_index'));

module.exports=router;