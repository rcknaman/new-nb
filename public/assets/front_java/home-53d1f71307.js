{let a=function(t,i){$(document).ready(function(){let e;e="post"==i?$(">.like-comment>.like-btn",$("#post-"+t)):$(">.comment-like>.like-btn",$("#comment-"+t)),$(e).popover({html:!0,content:function(){return("post"==i?$("#Post-reaction-popover-"+t):$("#Comment-reaction-popover-"+t)).html()}})})},n=function(o){$(document).on("click",".popover-body>div",function(){var e=new URL($(" a",$(this)).prop("href"));let t=new URLSearchParams(e.search);e=t.get("likeableId");let i;"post"==o?(i=$("#post-"+e),"unlike"==$(this).attr("id")?$(" .like-btn>div",$(i)).html('<i class="far fa-thumbs-up"></i><p>Like</p>'):$(" .like-btn>div",$(i)).html($(">a",$(this)).html())):(i=$("#comment-"+e),"unlike"==$(this).attr("id")?$(" .like-btn p",$(i)).html("Like."):(console.log($(">a",$(this)).html()),$(" .like-btn p",$(i)).append($(">a",$(this)).html())))})},i=function(o){let t=$("#comment-create-"+o);t.on("submit",function(e){e.preventDefault(),console.log("comment create"),$.ajax({type:"post",url:"/comment/create",data:t.serialize(),success:function(e){var t=$("#comment-list-"+o),i=s(e.data.comment,e.data.username);$(t).prepend(i),l(e.data.comment._id,"comment"),a(e.data.comment._id,"comment"),n("comment")},error:function(e){console.log(e)}})})},o=function(e,t){return`
      <div id="${e}-reaction-popover-${t._id}" class="hidden">
        <div class=" tracking-in-expand swing-top-fwd" id="like">

          <a href="/likes/toggle/?likeableId=${t._id}&type=${e}&reaction=like"><i class="fas fa-thumbs-up"></i></a>
        </div>
        <div class=" tracking-in-expand" id="haha">

          <a href="/likes/toggle/?likeableId=${t._id}&type=${e}&reaction=haha"><i class="fas fa-grin-tears"></i></a>
        </div>
        <div class=" tracking-in-expand" id="namaste">
          <a href="/likes/toggle/?likeableId=${t._id}&type=${e}&reaction=namaste"><i class="fas fa-praying-hands"></i></a>
        </div>
        <div class=" tracking-in-expand" id="sad">
          <a href="/likes/toggle/?likeableId=${t._id}&type=${e}&reaction=sad"><i class="fas fa-sad-cry"></i></a>                  
        </div>
        <div class=" tracking-in-expand" id="angry">
          <a href="/likes/toggle/?likeableId=${t._id}&type=${e}&reaction=angry"><i class="fas fa-angry"></i></a>   
        </div>
        <div class=" tracking-in-expand" id="unlike">
          <a href="/likes/toggle/?likeableId=${t._id}&type=${e}&reaction=unlike"><i class="fas fa-ban"></i></a>
        </div>
      </div>`},s=function(e,t){return $(`
        
        <li id="comment-${e._id}" class="comment">
            <div class="self-msg">
            <div class="username"><p>${t}</p></div>
            <div class="msg-content"><p>${e.content}</p></div>
            
            </div>
            <div class="comment-like">
            <a class="like-btn" tabindex="-1" href="#" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top">
                <p>like.</p>
                <span>0</span>
              </a>
            </div>
            `+o("Comment",e)+`
        </li>       
        `)},l=function(e,t){let i;i="post"==t?$(`#post-${e} .like-btn`):$(`#comment-${e} .like-btn`),$(i).on("click",function(e){e.preventDefault(),$(document).on("click",".popover-body>div",function(e){e.preventDefault(),$.ajax({type:"get",url:$(" a",$(this)).prop("href"),success:function(e){console.log(e)},error:function(e){console.log(e)}})})})},c=function(t,e){let i=$("+img",$(t));if(console.log("$(input)[0].files: ",$(t)[0].files),$(t)[0].files&&$(t)[0].files[0]){let e=new FileReader;e.onload=function(e){$(i).prop("src",e.target.result)},e.readAsDataURL($(t)[0].files[0])}},p=function(e,t){$(e).change(function(){$(e).parent().css("display","block"),c(this,t),f(this)})},e=function(){var e=$(".upload-btn");$(e).on("click",function(e){var t=$("#preview-body-content-grid"),i=$(">div",t).length+1;let o;var a=$(this).prop("id");console.log(a);let n;if("upload-video"==a)o="video/*",n=`
          <div class="preview-content" filetype="video">
            <input type="file" name="file${i}" accept=${o}>
            <span class="close_btn"><i class="far fa-times-circle"></i></span>
            <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
              <div class="preview-video-logo"><i class="fas fa-file-video"></i></div>
              <div class="preview-play"><i class="fas fa-play"></i></div>
            </div>
          </div>`;else if("upload-photo"==a)o="image/*",n=`
          <div class="preview-content" filetype="image">
          <span class="close_btn"><i class="far fa-times-circle"></i></span>
            <input type="file" name="file${i}" accept=${o}>
            <img src="" alt="photo"  data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
          </div>`;else{if("upload-audio"!=a)return;o="audio/*",n=`
          <div class="preview-content" filetype="audio">
          <span class="close_btn"><i class="far fa-times-circle"></i></span>
            <input type="file" name="file${i}" accept=${o}>
            <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
              <div class="preview-audio-logo"><i class="fas fa-music"></i></div>
              <div class="preview-play"><i class="fas fa-play"></i></div>
            </div>
          </div>`}$(t).append(n);i=$(`input[name=file${i}]`);$(i).parent().css("display","none"),p(i,o),$(i).click()})};e();let r=function(){let t=$("#upload-prep");$(t).on("click",function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(){$("#new-post-form").submit()},error:function(e){console.log(e)}})})},t=function(){$("#post-btn").click(function(e){e.preventDefault(),d()})},d=function(){var e,t=$("#preview-body-content-grid>div>input"),i=$("#upload-prep");t.length?(e=$(i).prop("href"),t=$(t).last().attr("name").slice(4),$(i).prop("href",e+t),r(),$(i).click()):(finalPost(),$("#new-post-form").submit())};t();let f=function(t){let e=$(t).parent(),i=$("#preview-popover");console.log("jkj: ",$(e).attr("filetype")),$(">div",$(e)).click(function(){if("audio"==$(e).attr("filetype")){$("#preview-popover").css({"padding-top":"0px"},{"padding-bottom":"0px"}),$("#offcanvasTop .btn-close").hasClass("btn-close-white")&&$("#offcanvasTop .btn-close").removeClass("btn-close-white"),$("#offcanvasTop").css("background-color","white");let e=new FileReader;e.onload=function(e){$(i).html(`
            

                <div id="player-logo" class="concentric-circles">

                <i class="fas fa-headphones-alt"></i>
              </div>
              <div class="preview-audio-player">

                <audio controls>

                    <source src="${e.target.result}" type="audio/mpeg">
                    Your Browser Does Not Support Radio
                </audio>
              </div>
            `)},e.readAsDataURL($(t)[0].files[0])}else if("video"==$(e).attr("filetype")){$("#preview-popover").css({"padding-top":"10px"},{"padding-bottom":"10px"}),$("#offcanvasTop .btn-close").addClass("btn-close-white"),$("#offcanvasTop").css("background-color","black");let e=new FileReader;e.onload=function(e){console.log("video"),$(i).html(`<video src="${e.target.result}"controls></video>`)},e.readAsDataURL($(t)[0].files[0])}}),$(">img",$(e)).click(function(){$("#preview-popover").css({"padding-left":"10px"},{"padding-right":"10px"}),$("#offcanvasTop .btn-close").addClass("btn-close-white"),$("#offcanvasTop").css("background-color","black");let e=new FileReader;e.onload=function(e){$(i).html(`<img src="${e.target.result}" height="400px" width="400px">`)},e.readAsDataURL($(t)[0].files[0]),$("#preview-popover").css({"padding-top":"10px"},{"padding-bottom":"10px"})})},u=function(t){console.log('ul[aria-labelledby="post-options-${postId}"] .post-delete-btn a: ',$('ul[aria-labelledby="post-options-${postId}"] .post-delete-btn a')),$(document).on("click",`ul[aria-labelledby="post-options-${t}"] .post-delete-btn a`,function(e){e.preventDefault(),$.ajax({type:"get",url:"/posts/destroy/"+t,success:function(){$("#post-"+t).remove()}})})},v=$(".post"),m=$(".comment");for(let t of v){let e=$(t).prop("id").slice(5);i(e),l(e,"post"),a(e,"post"),n("post"),u(e)}for(let t of m){let e=$(t).prop("id").slice(8);l(e,"comment"),a(e,"comment"),n("comment")}}let sessionCheck=function(){$("#post-something").click(function(e){$.ajax({type:"get",url:"/users/sessionCheck",success:function(e){"no"==e.data.allowed&&window.location.replace("/users/signin")}})})};sessionCheck(),$(document).on("click","#cancel-post",function(){$("#new-post-form").trigger("reset"),$("#preview-body-content-grid").html("")}),$(document).on("click","#preview-body-content-grid .close_btn",function(e){e.stopImmediatePropagation(),$(this).parent().remove()});