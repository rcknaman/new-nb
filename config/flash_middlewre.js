
module.exports.setFlash=function(req,res,next){
    //here we are setting the flash message from req.flash to res.flash
    res.locals.flash={
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}
