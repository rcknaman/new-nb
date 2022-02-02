const queue=require('../config/kue');

const commentMailer=require('../mailer/comment-mailer');

queue.process('emails',function(job,done){

    
    commentMailer.newComment(job.data);
    done();

});