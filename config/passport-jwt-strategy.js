

// JWT comprises of three things ('header'.'payload'.'signature')


const passport=require('passport');
//we have to install 'passport-jwt' for jwt authentication..
// jwt authentication basically is used when dealing with serving apis..

///syntax is present in the documentation of the same
const JWTStrategy=require('passport-jwt').Strategy;

const ExtractJWT=require('passport-jwt').ExtractJwt;

const User=require('../models/user');
const env=require('./enviroment');

let opts={

    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    //secret key for authentication 'codial'
    secretOrKey: env.passport_jwt_secret_key

}
//jwtPayload variable below contains the decrypted info of the user
passport.use(new JWTStrategy(opts,function(jwtPayload,done){

    User.findById(jwtPayload._id,function(err,user){
        if(err){
            console.log('error in finding user using JWT');
        }
        if(user){
            return done(null,user)
        }
        else{
            return done(null,false);
        }
    })



}));

module.exports=passport;