module.exports.home=function(req,res){
    console.log(req.cookies);
    res.cookie('kaddu',78);
    return res.render('home',{
        title: 'aloo',
        var1: '256'
    });
}