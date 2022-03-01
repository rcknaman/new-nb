
//"sequence is very important"

const express=require('express');
const env=require('./config/enviroment');
// importing morgan
const logger=require('morgan');
const cookieParser=require('cookie-parser');
const app=express(); 

require('./config/helper')(app);
const port = 8000; 
const expressLayouts=require('express-ejs-layouts');
app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
const db=require('./config/mongoose');

const session=require('express-session');

const passport=require('passport');

const passportJwt=require('./config/passport-jwt-strategy');
//it contains the main authentication function
const passportLocal=require('./config/passport-local-strategy');

const passportGoogle=require('./config/passport-google-oauth2-strategy');
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
//including connect-flash library
const flash=require('connect-flash');
//including flash custom middleware
const flash_mware=require('./config/flash_middlewre');
// setting up web socket usig socket.io
// for socket.io we are needing 'http' protocol
const chatServer=require('http').createServer(app);
// setup file for socket.io
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
// here we have to use port other than port used by our main server
chatServer.listen(5000);    
console.log('chat server is listening on port on 5000');

const path=require('path');

// it will render only when it is in development mode but will not render every time in production mode
if(env.codial_enviroment=='development'){

    //setting up sass
    app.use(sassMiddleware({

        //where the scss files are stored
        src: path.join(__dirname,env.asset_path,'scss'),
        //where to put the css files
        dest: path.join(__dirname,env.asset_path,'css'),
        //will the error display while compiling the scss to css if it comes
        debug:true,
        //will the compiled css file's code be compact written or be in multiple lines
        outputStyle:'extended',
        //where will the server search for css files while running
        prefix:'/css'

    }));


}




//this is used to decrypt the post request data in other words it includes 'body key to 'req' object
app.use(express.urlencoded());
console.log('env.asset_path: ',path.join(__dirname,env.asset_path,'scss'));
app.use(express.static(env.asset_path));
//when '/uploads' request will came then we will use /uploads  folder as assets and without this we could'nt have
//access to avatar files..
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(logger(env.morgan.mode,env.morgan.options));


//used to encrypt and decrypt the cookie while sending or reciving the cookie
app.use(cookieParser());




app.set('view engine','ejs');
app.set('views','./views');

//here we are telling that which key to use to encrypt our cookie before sending it to client's browser

app.use(session({
    name:'codial',
    secret: env.session_cookie_key,
    //it implies that do we have to save the info of the user whose has'nt signed in yet
    saveUninitialized:false,
    //it implies that do we need to resave the data of the user whose data is already saved with us
    resave:false,
    cookie: {
        maxAge:(20 * 365 * 24 * 60 * 60* 1000)
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
//flash uses session cookies to store itself as a flash message so that whenever user sign in or out 
//accordingly cookies will be added and deleted according to that flash messgaes will appear..
//during signin or out only once the flash message will appear..i.e if we refresh the page
//the messsage will be removed and will not appear in the views..
//since it is using cookies so we have to call it after the session middleware..but yes it must be called before 
//calling router
app.use(flash());
app.use(flash_mware.setFlash);

//------------

//we have to put router at this position after we have told express that we are using passport in above line
app.use('/',require('./router'));




app.listen(port,function(err){

    if(err){
        console.log('error in listening to port',err);
        
    }
    console.log(`server is up and running on port: ${port}`);
})