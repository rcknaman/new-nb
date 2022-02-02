const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');
const env=require('./enviroment');

// below defines the configurations via which the mails will be sent
let transporter=nodemailer.createTransport(env.smtp);
// below code tells us where we will be saving the ejs files which we are going to render for sending mail
let renderTemplate=(data,relativePath)=>{

    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering template',err);
                return;
            }
            
            mailHTML=template;
            


            // don't return it from here it won't work
            // return mailHTML;
            
        }   
    );
    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}
