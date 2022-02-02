const env=require('../config/enviroment');
const fs=require('fs');
const path=require('path');

// it is helping views to have access of the static files by connecting them with rev-manifest.json inside public/assets
module.exports=function(app){

    app.locals.assetPath=function(filePath){
        if(env.codial_enviroment=='development'){
            return '/'+filePath;
        }
        console.log('staticfiles: ','/'+JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath]);
        return '/'+JSON.parse(fs.readFileSync(path.join(__dirname,'../public/assets/rev-manifest.json')))[filePath];
    }

}