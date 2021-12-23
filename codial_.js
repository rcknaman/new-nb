
//"sequence is very important"

const express=require('express');
const cookieParser=require('cookie-parser');
const app=express(); 
const port = 8000; 
const db=require('./config/mongoose');

const session=require('express-session');

const passport=require('passport');


//it contains the main authentication function
const passportLocal=require('./config/passport-local-strategy');

//Every time we restarts the server the cookie encryption key gets changed
//in our server and when user's browser sends the cookies those cookies gets expired(since we restarted the 
///server the previous encrypted cookies are forgotten by our server) (expired cookies means either that the 
//encrypted key  that the server has generated is no longer valid since the server has no avaliable
// data of previous encryption keys(since it has restarted) so it cannot authenticate 
//the user based on previous encryp. key OR simply the time duration of the previous cookies has been expired)
//Mongostore stores the old encrypted key(cookie) so that if the server restarts then the server could 
//remember the old encryption key and doesn't have to make user sign in again
const MongoStore=require('connect-mongo');

//sass module
const sassMiddleware =require('node-sass-middleware');


//setting up sass
app.use(sassMiddleware({

    //where the scss files are stored
    src: './assets/scss',
    //where to put the css files
    dest:'./assets/css',
    //will the error display while compiling the scss to css if it comes
    debug:true,
    //will the compiled css file's code be compact written or be in multiple lines
    outputStyle:'extended',
    //where will the server search for css files while running
    prefix:'/css'

}))


//this is used to decrypt the post request data in other words it includes 'body key to 'req' object
app.use(express.urlencoded());


//used to encrypt and decrypt the cookie while sending or reciving the cookie
app.use(cookieParser());




app.set('view engine','ejs');
app.set('views','./views');


//here we are telling that which key to use to encrypt our cookie before sending it to client's browser

app.use(session({
    name:'codial',
    secret: 'blahsomething',
    //it implies that do we have to save the info of the user whose has'nt signed in yet
    saveUninitialized:false,
    //it implies that do we need to resave the data of the user whose data is already saved with us
    resave:false,
    cookie: {
        maxAge:(1000*60*100)
    },
    //here we are telling the mongo store the url where we have to store the old cookies
    store: MongoStore.create(
        {

            // mongooseConnection: db,
            // autoRemove:'disabled'
            mongoUrl: 'mongodb://localhost/session-cookie-store'

        },
        function(err){
            console.log(err || 'connect-mongodb setup ok'); 
        }
    
    
    )
})
);


//----------- here we are telling the express that we are using passport for authentication
app.use(passport.initialize());

app.use(passport.session());

app.use(passport.setAuthenticatedUser);


//------------

//we have to put router at this position after we have told express that we are using passport in above line
app.use('/',require('./router'));




app.listen(port,function(err){

    if(err){
        console.log('error in listening to port',err);
        
    }
    console.log(`server is up and running on port: ${port}`);
})