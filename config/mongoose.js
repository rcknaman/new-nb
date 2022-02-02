const mongoose=require('mongoose');
const env=require('./enviroment');
mongoose.connect(`mongodb://localhost/${env.db_name}`);
const db=mongoose.connection;

db.on('error',console.error.bind(console,'error in connecting to db'));

db.once('open',function(){
    console.log('successfully connected to db');
});

module.exports=db;