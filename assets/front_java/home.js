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
              return $("#Post-reaction-popover").html();
            }else{
              return $("#Comment-reaction-popover").html();
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


  let createPost=function(){

    let newPostForm=$('#new-post-form');
    newPostForm.submit(function(e){

        console.log(e);
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/posts/create',
            data: newPostForm.serialize(),
            success: function(data){
                let newPost=new newPostDom(data.data.post,data.data.username);
                $('.posts-container').prepend(newPost);

                commentCreate(data.data.post._id);
                likeHandler(data.data.post._id,'post');
                popoverfunc(data.data.post._id,'post');
                likeReact('post');
            },
            error: function(error){
                console.log(error.responseText);
            } 
        });
    });
        
  }


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
      <div id="${likeabletype}-reaction-popover" class="hidden">
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


    let newPostDom=function(post,username){
        return $(`
        <div class="post" id="post-${post._id}"> 
        <p>${username}</p>
        <div class="post-border">
    
          <div class="post-content">
              <p>${ post.content }</p>
            <!-- <img src="./photoicon.png" alt=""> -->
          </div>
        </div>
        <div class="like-comment">
          
    
          <a class="like-btn" tabindex="-1" href="#" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top">
            <div class="like-comment-div"><i class="far fa-thumbs-up"></i><p>Like</p></div>
          </a>
            <!-- ------------------------------- -->
          `
          +reactiontabs('Post',post)+
          `
         <!-- --------------------------------------- -->
          <div class="like-comment-div user-select"  data-bs-toggle="modal" data-bs-target="#comments"><i class="far fa-comments"></i>Comment</div>
    
          <div class="modal fade" id="comments" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
              <div class="modal-content modal-content-comment">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Comments</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="commment-img-container">
    
                    <!-- <img src="./photoicon.png" alt=""> -->
                    <p></p>
                    <div class="comment-logo"><i class="far fa-comments"></i></div>
                  </div>
                 
                  <div class="comment-list-container">
    
                    <ul class="comment-container" id="comment-list-${post._id}">
                        
    
      
                    </ul> 
                  </div>
                </div>
                <form class="modal-footer" id="comment-create-${post._id}" method="post" action="/comment/create">
                  <div class="comment-input-div"><input name="comment" class="form-control" type="text" placeholder="Comment here.." aria-label="default input example"></div>
                  <input type="hidden" name="postid" value="${post._id}">
                  <button type="submit" class="comment-send"><i class="fas fa-angle-double-right"></i></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
        
        
        `)
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
    let fileUploader=function(){

      $('#upload-photo').on('click',function(){

        let previewGrid=`<div class="preview-content"><input type="file"></div>`;

        $('#preview-body-content-grid').append(previewGrid);
        let newPreview=$('.preview-content').last();
        $(' input',newPreview).click();

      });
    }
    fileUploader();




    let postList=$('.post');
    let commentList=$('.comment');
    for(let post of postList){

      let likeableId=$(post).prop('id').slice(5);

      commentCreate(likeableId);
      likeHandler(likeableId,'post');
      popoverfunc(likeableId,'post');
      likeReact('post');
    }
    for(let comment of commentList){
      let likeableId=$(comment).prop('id').slice(8);
      likeHandler(likeableId,'comment');
      popoverfunc(likeableId,'comment');
      likeReact('comment');
    }

    createPost();

}




