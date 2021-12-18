const express=require('express');
const cookieParser=require('cookie-parser');
const app=express(); 
const port = 8000; 
const db=require('./config/mongoose');

app.use(express.urlencoded());

app.use(cookieParser());


app.use('/',require('./router'));

app.set('view engine','ejs');
app.set('views','./views');

app.listen(port,function(err){

    if(err){
        console.log('error in listening to port',err);
        
    }
    console.log(`server is up and running on port: ${port}`);
})