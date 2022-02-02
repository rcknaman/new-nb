const rfs=require('rotating-file-stream');
const fs=require('fs');
const path=require('path');

// where we are storing the log statemants
const logDirectory=path.join(__dirname,'../production_logs');

// if the file for storing logs exists then ok otherwise create it!
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// rfs will create one file a day which will store logs
const accessLogStream=rfs.createStream('access.log',{
    interval:'1d',
    path:logDirectory
})
// putting all the password and secret keys in one file and access those from here itself
const development={
    codial_enviroment:'development',
    asset_path:'./assets',
    session_cookie_key:'blahsomething',
    db_name:'codialdata',
    smtp:{

        service:'gmail',
        // whnever we want to send the bulk mails to our users,gmail creates an domain with which
        // we will be intracting as a developer here that domain is 'smtp.gmail.com'
        host:'smtp.gmail.com',
        // smtp over ssl/tls works on port 587
        // default port of smtp is 25
        port:587,
        // if port :485 then only follow will be true
        secure:false,
        auth:{
            user:'namanagrawal360@gmail.com',
            pass: '2603201234'
        }
    },
    // morgan basically is used to store the log statements in a file which will be used while debugging
    morgan:{
        mode:'dev',
        options: {stream:accessLogStream}
    },
    google_clientID: '158209969793-qjso8flm5i2i4dbm5so06ofhsbsbk8pt.apps.googleusercontent.com',
    google_clientSecret: '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',
    google_callbackURL: 'http://localhost:8000/users/auth/google/callback',
    passport_jwt_secret_key:'codial'
}
const production={
    // here for each key we have stored the value in the enviroment variables
    // we can access the enviroment variables in terminal by typing process.env
    codial_enviroment:process.env.codial_enviroment,

    asset_path:process.env.codial_asset_path,
    session_cookie_key:process.env.codial_session_cookie_key,
    db_name:process.env.codial_db_name,
    smtp:{

        service:'gmail',
        // whnever we want to send the bulk mails to our users,gmail creates an domain with which
        // we will be intracting as a developer here that domain is 'smtp.gmail.com'
        host:'smtp.gmail.com',
        // smtp over ssl/tls works on port 587
        // default port of smtp is 25
        port:587,
        // if port :485 then only follow will be true
        secure:false,
        auth:{
            user:process.env.codial_user,
            pass: process.env.codial_pass
        },
    },
    google_clientID: process.env.codial_google_clientID,
    google_clientSecret: process.env.codial_google_clientSecret,
    google_callbackURL: process.env.codial_google_callbackURL,
    passport_jwt_secret_key:process.env.codial_passport_jwt_secret_key,
    morgan:{
        mode:'combined',
        options: {stream:accessLogStream}
    }
}
// module.exports=eval(process.env.codial_enviroment)==undefined?development:eval(process.env.codial_enviroment);
module.exports=development;
// module.exports=development;