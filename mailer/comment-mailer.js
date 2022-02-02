const nodeMailer=require('../config/nodemailer');


// another way of exporting the method

exports.newComment= (comment)=>{

    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/comment1.ejs');
    nodeMailer.transporter.sendMail({
        from:'namanagrawal360@gmail.com',
        to:comment.user.email,
        subject:"NEW COMMENT PUBLISHED",
        html:htmlString
        // info contains the information about the request which has to be sent
    },(err,info)=>{
        if(err){console.log('error in sending mail',err);return;}
        return;
    });
}