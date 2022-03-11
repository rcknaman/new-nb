
const gulp=require('gulp');
const sass=require('gulp-sass')(require('sass'));//it will convert sass to css

const cssnano=require('gulp-cssnano');//it will uglify that css file by congesting the code 
const rev=require('gulp-rev');//it will change the name of the file inside public/assets/folders/ every time the
// gulp build will be called

const uglify=require('gulp-uglify');//it will compress the js files

let imagemin=require('gulp-imagemin');//it will conpress images
const del=require('del');///it will delete previous files inside public/assets/folders/ every time the
// gulp build will be called

// every gulp task has a user defined name
// name='css'
gulp.task('css',function(){
    console.log('css');
    // source files are inside the path of the following format
    // *=> indicates the file name
    // **=> indicates folder name
    // -------------conversion and compression section----------------------------
    gulp.src('./assets/scss/*.scss')
    // converting sass->css
    .pipe(sass())
    // minify css 
    .pipe(cssnano({ discardUnused: false,reduceIdents: false}))
    // where to save css files
    .pipe(gulp.dest('./assets/css'))
    // ------------------------------------------------------------------
    // -----------renaming and saving section into the target folder(public folder)
    // source files are inside the path of the following format

    // if we write source(src) as /**/*.css all the folders having this structure will get that operation and save as it is 
    // in the target folder..for eg
    // say there is a folder 'xyz' having files style1.css,style2.css then system will take action on style1.css and
    // style2.css of 'xyz' folder and say the target folder where to save files is 'target' then the whole folder
    // 'xyz' with its files in it will be saved inside the 'target' folder
    
    // but say if we write source(src) as /xyz/*.css then only the files of folder of 'xyz' will get that operation
    //  and get saved in the target folder **without their parent folder i.e. "xyz" like target/style1.css **

    return gulp.src('./assets/**/*.css')
        // renaming the files when current task is called
        .pipe(rev())
        // where to save css files
        .pipe(gulp.dest('./public/assets'))
        // mapping the files and storing that map inside rev-manifest.json so that using helper function inside config/helper.js
    // we could give access of static files to the views 
        .pipe(rev.manifest({
            cwd: 'public',
            merge:true
        }))
    .pipe(gulp.dest('./public/assets'))
});

gulp.task('javascript',function(done){
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
   .pipe(uglify())
   .pipe(rev())
   .pipe(gulp.dest('./public/assets'))
   .pipe(rev.manifest({
       cwd: 'public',
       merge: true
   }))
   .pipe(gulp.dest('./public/assets'));
    done();
})
// name='images'
gulp.task('images',function(done){
    console.log('images');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
})
// name='clean:assets'
gulp.task('clean:assets',function(done){
    console.log('cleaning assets');
    del.sync('./public/assets');
    done();
});
// name='build'
gulp.task('build',gulp.series('clean:assets','css','javascript','images'),function(done){
    console.log('building assets');
    done();
});