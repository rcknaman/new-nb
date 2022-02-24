{


  let popoverfunc=function(likeableId,likeabletype) {
    // Enables popover
    $(document).ready(function(){

      let like_btn;
      if(likeabletype=='post'){
        like_btn=$(">.like-comment>.like-btn",$(`#post-${likeableId}`));
      }else{
        like_btn=$(">.comment-like>.like-btn",$(`#comment-${likeableId}`));
      }
      $(like_btn).popover({
          html: true,
          content: function () {
  
            if(likeabletype=='post'){
              return $(`#Post-reaction-popover-${likeableId}`).html();
            }else{
              return $(`#Comment-reaction-popover-${likeableId}`).html();
            }
          }
      });
    });

  }

  let likeReact = function (likeabletype) {
    $(document).on('click','.popover-body>div', function () {

      const url=new URL($(' a',$(this)).prop('href'));
      let params=new URLSearchParams(url.search);
      let likeableId=params.get('likeableId');
      let domlikeableId;

      if(likeabletype=='post'){
        domlikeableId=$(`#post-${likeableId}`);

        if($(this).attr('id')=='unlike'){

          $(' .like-btn>div',$(domlikeableId)).html(`<i class="far fa-thumbs-up"></i><p>Like</p>`);
  
        }else{
    
          $(' .like-btn>div',$(domlikeableId)).html($('>a', $(this)).html());
        }
      }else{
        domlikeableId=$(`#comment-${likeableId}`);
        if($(this).attr('id')=='unlike'){

          $(' .like-btn p',$(domlikeableId)).html(`Like.`);
  
        }else{
          console.log($('>a', $(this)).html());
          $(' .like-btn p',$(domlikeableId)).append($('>a', $(this)).html());
        }
      }

    });

}
// ==========================================================================================


  


  let commentCreate=function(postid){
    let newComment=$(`#comment-create-${postid}`);

    newComment.on('submit',function(e){

        e.preventDefault();
        console.log('comment create');
        $.ajax({

          type:'post',
          url: '/comment/create',
          data:newComment.serialize(),
          success: function(data){
              let list=$(`#comment-list-${postid}`);
              let comment=newCommentDom(data.data.comment,data.data.username);
              $(list).prepend(comment);
              likeHandler(data.data.comment._id,'comment');
              popoverfunc(data.data.comment._id,'comment');
              likeReact('comment');
          },  
          error: function(error){
              console.log(error);
          }
      });
    });

  }
  let reactiontabs=function(likeabletype,likeable){

      let str=`
      <div id="${likeabletype}-reaction-popover-${likeable._id}" class="hidden">
        <div class=" tracking-in-expand swing-top-fwd" id="like">

          <a href="/likes/toggle/?likeableId=${likeable._id}&type=${likeabletype}&reaction=like"><i class="fas fa-thumbs-up"></i></a>
        </div>
        <div class=" tracking-in-expand" id="haha">

          <a href="/likes/toggle/?likeableId=${likeable._id}&type=${likeabletype}&reaction=haha"><i class="fas fa-grin-tears"></i></a>
        </div>
        <div class=" tracking-in-expand" id="namaste">
          <a href="/likes/toggle/?likeableId=${likeable._id}&type=${likeabletype}&reaction=namaste"><i class="fas fa-praying-hands"></i></a>
        </div>
        <div class=" tracking-in-expand" id="sad">
          <a href="/likes/toggle/?likeableId=${likeable._id}&type=${likeabletype}&reaction=sad"><i class="fas fa-sad-cry"></i></a>                  
        </div>
        <div class=" tracking-in-expand" id="angry">
          <a href="/likes/toggle/?likeableId=${likeable._id}&type=${likeabletype}&reaction=angry"><i class="fas fa-angry"></i></a>   
        </div>
        <div class=" tracking-in-expand" id="unlike">
          <a href="/likes/toggle/?likeableId=${likeable._id}&type=${likeabletype}&reaction=unlike"><i class="fas fa-ban"></i></a>
        </div>
      </div>`
    
      return str;


  }


    let newCommentDom=function(comment,username){

        return $(`
        
        <li id="comment-${comment._id}" class="comment">
            <div class="self-msg">
            <div class="username"><p>${username}</p></div>
            <div class="msg-content"><p>${comment.content}</p></div>
            
            </div>
            <div class="comment-like">
            <a class="like-btn" tabindex="-1" href="#" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top">
                <p>like.</p>
                <span>0</span>
              </a>
            </div>
            `
            +reactiontabs('Comment',comment)+
            `
        </li>       
        `)
    }

    let likeHandler=function(likeableId,likeabletype){

      let like_btn;
      if(likeabletype=='post'){
        like_btn=$(`#post-${likeableId} .like-btn`);
      }else{
        like_btn=$(`#comment-${likeableId} .like-btn`);
      }


      $(like_btn).on('click',function(e){

        e.preventDefault();

          $(document).on('click','.popover-body>div',function(e){
            e.preventDefault();
            // console.log($(' a',$(this)).prop('href'));

            // http://localhost:8000/likes/toggle/?likeableId=xyz&type=Post&reaction=namaste

            $.ajax({
              type: 'get',
              url: $(' a',$(this)).prop('href'),
              success:function(data){

                console.log(data);
              },
              error:function(err){

                console.log(err);

              }
            })
          });
        });
    }


 

    // createPost();
// ------------------------------------------------------------------------------------

// cannot use ajax for posting data and files together!!!

    let filePreview=function(input,type){
    
      let img=$('+img',$(input));
      console.log('$(input)[0].files: ',$(input)[0].files);
      if($(input)[0].files && $(input)[0].files[0]){  
        let reader=new FileReader();
        reader.onload=function(e){

          $(img).prop('src',e.target.result);

        }
        reader.readAsDataURL($(input)[0].files[0]);
      }


    }

    let aftergivingvaluetoinput=function(input,type){

        $(input).change(function(){
          $(input).parent().css('display','block');
          filePreview(this,type);
          main_preview_field(this);
        });
    }


    let fileUploader=function(){
      let button=$('.upload-btn');
      $(button).on('click',function(e){

        let previewContainer=$('#preview-body-content-grid');
        let previewCount=$('>div',previewContainer).length+1;
        let type;
        let buttonId=$(this).prop('id');
        console.log(buttonId);
        let inputFileDom;
        if(buttonId=='upload-video'){
          type="video/*";
          inputFileDom=`
          <div class="preview-content" filetype="video">
            <input type="file" name="file${previewCount}" accept=${type}>
            <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
              <div class="preview-video-logo"><i class="fas fa-file-video"></i></div>
              <div class="preview-play"><i class="fas fa-play"></i></div>
            </div>
          </div>`


          
        }else if(buttonId=='upload-photo'){
          type="image/*";
          inputFileDom=`
          <div class="preview-content" filetype="image">
            <input type="file" name="file${previewCount}" accept=${type}>
            <img src="" alt="photo"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
          </div>`

         
        }else if(buttonId=='upload-audio'){
          type="audio/*";
          inputFileDom=`
          <div class="preview-content" filetype="audio">
            <input type="file" name="file${previewCount}" accept=${type}>
            <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
              <div class="preview-audio-logo"><i class="fas fa-music"></i></div>
              <div class="preview-play"><i class="fas fa-play"></i></div>
            </div>
          </div>`

          
        }else{
          return;
        }

        // let inputFileDom=`<div class="preview-content"><input type="file" name="file${previewCount}" accept=${type}><img src="" alt="photo"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop"></div>`

        $(previewContainer).append(inputFileDom);
        let newPreview=$(`input[name=file${previewCount}]`);
        $(newPreview).parent().css('display','none');
        aftergivingvaluetoinput(newPreview,type);
        $(newPreview).click();
        
      }); 
    }
    fileUploader();

    let fileCountSender=function(){


      let uploadLink=$('#upload-prep');
      $(uploadLink).on('click',function(e){
        e.preventDefault();
        $.ajax({
          type:'get',
          url:$(uploadLink).prop('href'),
          success:function(){
            $("#new-post-form").submit();
          },
          error:function(error){
            console.log(error);
          }
        });
      });
    }
    let postInitialize=function(){
      $('#post-btn').click(function(e){
        e.preventDefault();
        beforeupload();
      });
    }
    let beforeupload=function(){

        let fileArray=$('#preview-body-content-grid>div>input');
        let uploadLink=$('#upload-prep');

        if(fileArray.length){
          let str=$(uploadLink).prop('href');
          $(uploadLink).prop('href',str+fileArray.length.toString());
          fileCountSender();
          $(uploadLink).click();
        }else{
          finalPost();
          $("#new-post-form").submit();
        }


    }

    postInitialize();

    let main_preview_field=function(fileInputField){


      let smallPreview=$(fileInputField).parent();
      let previewpopover=$('#preview-popover');
      console.log('jkj: ',$(smallPreview).attr('filetype'));
      $('>div',$(smallPreview)).click(function(){
        // console.log('jkj: ',$(smallPreview).prop('filetype'));
        if($(smallPreview).attr('filetype')=='audio'){
          $('#preview-popover').css({'padding-top':'0px'},{'padding-bottom':'0px'});
          if($('#offcanvasTop .btn-close').hasClass('btn-close-white')){
            $('#offcanvasTop .btn-close').removeClass('btn-close-white');
          }
          $('#offcanvasTop').css('background-color','white');
          let reader=new FileReader();
          reader.onload=function(e){
            
            $(previewpopover).html(`
            

                <div id="player-logo" class="concentric-circles">

                <i class="fas fa-headphones-alt"></i>
              </div>
              <div class="preview-audio-player">

                <audio controls>

                    <source src="${e.target.result}" type="audio/mpeg">
                    Your Browser Does Not Support Radio
                </audio>
              </div>
            `);
          }

          reader.readAsDataURL($(fileInputField)[0].files[0]);

        }else if($(smallPreview).attr('filetype')=='video'){
          $('#preview-popover').css({'padding-top':'10px'},{'padding-bottom':'10px'});
          $('#offcanvasTop .btn-close').addClass('btn-close-white');
          $('#offcanvasTop').css('background-color','black');
          let reader=new FileReader();
          reader.onload=function(e){
            console.log('video');
            $(previewpopover).html(`<video src="${e.target.result}"controls></video>`);
          }
          reader.readAsDataURL($(fileInputField)[0].files[0]);
        }
      });
      $('>img',$(smallPreview)).click(function(){

        $('#preview-popover').css({'padding-left':'10px'},{'padding-right':'10px'});
        $('#offcanvasTop .btn-close').addClass('btn-close-white');
        $('#offcanvasTop').css('background-color','black');
        let reader=new FileReader();
        reader.onload=function(e){

          $(previewpopover).html(`<img src="${e.target.result}" height="400px" width="400px">`);
        }
        reader.readAsDataURL($(fileInputField)[0].files[0]);

        $('#preview-popover').css({'padding-top':'10px'},{'padding-bottom':'10px'});
      })
    }

    let deletePost=function(postId){
      console.log('ul[aria-labelledby="post-options-${postId}"] .post-delete-btn a: ',$('ul[aria-labelledby="post-options-${postId}"] .post-delete-btn a'));
      $(document).on('click',`ul[aria-labelledby="post-options-${postId}"] .post-delete-btn a`,function(e){
        e.preventDefault();
        $.ajax({
    
          type:'get',
          url:`/posts/destroy/${postId}`,
          success:function(){
            $(`#post-${postId}`).remove();
          }
    
        });
    
    
      });
    
    
    }

    let postList=$('.post');
    let commentList=$('.comment');
    for(let post of postList){
    
      let likeableId=$(post).prop('id').slice(5);
      commentCreate(likeableId);
      likeHandler(likeableId,'post');
      popoverfunc(likeableId,'post');
      likeReact('post');
      deletePost(likeableId);
    }
    for(let comment of commentList){
      let likeableId=$(comment).prop('id').slice(8);
      likeHandler(likeableId,'comment');
      popoverfunc(likeableId,'comment');
      likeReact('comment');
    }



}

let sessionCheck=function(){

  $('#post-something').click(function(e){
    $.ajax({
      type:'get',
      url:'/users/sessionCheck',
      success:function(data){
        if(data.data.allowed=='no'){
          window.location.replace("/users/signin");
        }
      }
    })
  });

}

sessionCheck();

