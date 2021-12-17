const express=require('express');
const app=express(); 
const port = 8000; 

app.use('/',require('./router'));

app.use('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){

    if(err){
        console.log('error in listening to port',err);
        
    }
    console.log(`server is up and running on port: ${port}`);
})