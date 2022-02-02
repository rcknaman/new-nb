const nodeMailer=require('../config/nodemailer');

exports.accessToken=function(data){

    let htmlString=nodeMailer.renderTemplate({TokenLink:data.tokenLink,name:data.user.name},'/accessToken/accessToken.ejs');

    nodeMailer.transporter.sendMail({

        from:'namanagrawal360@gmail.com',
        to:data.user.email,
        subject:'access token link',
        html:htmlString
    },function(err,info){
        if(err){
            console.log('error in sending Token!',err);
            return;
        }else{
            console.log('access token sent!',info);
            return;
        }
    });
}