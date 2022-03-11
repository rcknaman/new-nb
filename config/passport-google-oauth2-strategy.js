const passport=require('passport');

const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto =require('crypto');
const env=require('./enviroment');
const User=require('../models/user');

// telling the passport that we are using new strategy google-oauth
passport.use(new googleStrategy({
        clientID: env.google_clientID,
        clientSecret: env.google_clientSecret,
        callbackURL: env.google_callbackURL 
    },function(accessToken,refreshToken,profile,done){

            
        //callback and .exec() do here the same thing..we are using callback here

        //finding the user..if found then set this as req.user
        //if not found then create the user and set it as req.user
        User.findOne({email:profile.emails[0].value},function(err,user){

            if(err){
                console.log('error in finding user:::: google oauth2');
                return done(err);
            }
            console.log(profile);
            if(user){
                //don't return 'true' in place of 'user'
                return done(null,user);
            }
            else{

                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    //since we are signing in using google..google will provide our server with the name and email but not
                    //password..so in background we are setting some random password to the field so that it wi
                    password:crypto.randomBytes(20).toString('hex')
                },function(err,user){

                    if(err){
                        console.log('error in creating user:::: google oauth2');
                        //don't return 'true' in place of 'user'
                        return done(null,user);
                    }
                    console.log(user);
                    return done(null,user);
                });
            }
        });
    }
));
module.exports=passport;
