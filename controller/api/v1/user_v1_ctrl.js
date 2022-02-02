//'jsonwebtoken' is library used to create the token,we have to install it explicitly
//passport-jwt can decrypt the token created by 'jsonwebtoken'  
const jwt=require('jsonwebtoken');

const User=require('../../../models/user');
const env=require('../../../config/enviroment');
//whent he user signs in we provide him with  the token
module.exports.createSession=async function(req,res){


    try{


        let user=await User.findOne({email:req.body.email});//checking if the user who is requesting to signin actually
        //exists or not!
        console.log(req.body);
        if(user && user.password==req.body.password){//if the user is authenticated then we are going to provide him
            //with a token..it is somewhat different from cookies as cookies are automatically created and stored inside 
            // user's browser when the user signs in..but in case of token we explicitly have to provide the user
            //with the token
            return res.json(200,{

                data:{
                    //here we used 'codial as an encryption key for the token and same key is used as the decryption
                    //key by passport-jwt
                    //
                    token:jwt.sign(user.toJSON(),env.passport_jwt_secret_key,{expiresIn: '1000000'}),

                },
                message:'token created successfully'

            });
        }else{

            return res.json(422,{
                message:'error in token creation'
            });
        }
    

    }
    catch(error){
        return res.json(500,{
            message:'internal server error'
        });
    }




}