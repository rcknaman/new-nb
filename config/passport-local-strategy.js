const passport=  require('passport');

const LocalStrategy=require('passport-local').Strategy;

const database=require('../models/user');

//for authenticating the user when he tries to sign in
passport.use(new LocalStrategy({
        //telling passport that to select 'email' as a name field
        usernameField: 'email',
        // passReqToCallback allow us to include an 'req' parameter to the below callback function
        passReqToCallback:true
    },
    function(req,email,password,done){
        //here the 1st argment 'email' is from database and 2nd one is the 'email' from the user
        ///who is requesting to sign in
        database.findOne({email:email},function(err,user){

            if(err){
                
                req.flash('error',err);
                //since we are using javascript so the functions could contain less no. of parameters 
                //compared to their capacity 
                //so in this case 1st parameter is pertaining to error
                //so error==err
                return done(err);
            }
            
            if(!user || user.password!=password){
                
                req.flash('error','invalid username or password!');
                //done is an object which can contain two arguments 1st one being corresponding to error 
                //and 2nd one pertaining to authentication
                //here error==null
                //authentication==false
                return done(null,false);
            }
            //here user object acts like a boolean value
            //so,error==null
            //authentication==user(true)
            //this 'user' is from database given that the user is present in the database according
            //to the given email and password
            return done(null,user);
        });
    }
));

//serializing 
//serializing->it is the method that handles the situation when the user sign in..its role is to send
//the cookies to the user's browser when he signs in so that next time when the user enters our website
//he does'nt need to sign in again(we could able to identify him using the cokies provided by him)
passport.serializeUser(function(user,done){
    done(null,user.id);
});
//when the user visit to our page again then his browser will send the cookies that we had prviosly saved
//in his browser..now we are just searching his identity on the basis of the cookies provided by his browser
passport.deserializeUser(function(id,done){
    database.findById(id,function(err,user){
        if(err){
            return done(err);
        }
        return done(null,user);
    })
});

//it is a user defined function going to be used as a middleware in the users-router file
passport.checkAuthentication=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/signin')
}

passport.setAuthenticatedUser=function(req,res,next){

    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and here we are just 
        //sending it to the res.locals for the views
        res.locals.user=req.user;
    }
    next();
}
///here we are simply exporting the methods present in this module
module.exports=passport;