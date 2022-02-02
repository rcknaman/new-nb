{let e=function(){let t=$("#new-post-form");t.submit(function(e){e.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:t.serialize(),success:function(e){var t=new n(e.data.post,e.data.username);$("#posts-container").prepend(t),l(e.data.flash),i(e.data.post),o($(" .delete-btn",t)),c($(">.likes-container",t))},error:function(e){console.log(e.responseText)}})})},n=function(e,t){return $(`
        <li id="post-${e._id}" class="post"><small>
                <a href="posts/destroy/${e._id}" class="delete-btn">x</a>
            </small>
            <h4>${t}</h4>
            ${e.content} 
            
            <br><br>
            <form class="likes-container">
                <input type="hidden" name="likeableId" value="${e._id}">
                <input type="hidden" name="type" value="Post">
                <button type="submit">&#128077;</button>
                <p>Likes: <span id="post-like-${e._id}">${e.likes.length}</span> </p>
            </form>
            <br><br>
            <p>comments:</p>
        
            <ul id="comment-list-${e._id}" class="comments">

            </ul>
                                             
            <form action="/comment/create" method="post" id="comment-create-${e._id}">
        
                <textarea name="comment" cols="30" rows="3" placeholder="comment.."></textarea>
                <input type="hidden" name="postid" value="${e._id}">
                <input type="submit" value="post-comment">
                
            </form>
            <p>--------------------------------------------------------------------------</p>
            </li>
        
        
        `)},o=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(e){$("#post-"+e.data.post_id).remove(),l(e.data.flash)},error:function(e){console.log(e.responseText)}})})},l=function(e){new Noty({theme:"relax",text:""+e,type:"success",layout:"topRight",timeout:1500}).show()},a=function(e,t){return $(`
        
            <li id="comment-${e._id}" class="comment">
                <small>
                    <a href="comment/destroy/${e._id}" class="delete-comment">x</a>
                </small>
                <div class="comment-content">
                    <p><h4>${t}</h4></p>
                    <p>-${e.content}</p>
                    <form class="likes-container">
                        <input type="hidden" name="likeableId" value="${e._id}">
                        <input type="hidden" name="type" value="Comment">
                        <button type="submit">&#128077;</button>
                        <p>Likes: <span id="comment-like-${e._id}">${e.likes.length}</span> </p>
                    </form>
                </div>

                
            </li>
        
        `)},i=function(o){let t=$("#comment-create-"+o._id);t.submit(function(e){e.preventDefault(),$.ajax({type:"post",url:"/comment/create",data:t.serialize(),success:function(e){var t=$("#comment-list-"+o._id),n=a(e.data.comment,e.data.username);$(t).prepend(n),l(e.data.flash),s($(" .delete-comment",n)),c($(">.comment-content>.likes-container",n))},error:function(e){console.log(e.responseText)}})})},s=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(e){$("#comment-"+e.data.commentId).remove(),l(e.data.flash)},error:function(e){console.log(e)}})})};e();let c=function(l){$(l).submit(function(e){e.preventDefault();e=$(this).serialize();$.ajax({type:"post",url:"/likes/toggle/?"+e,success:function(e){var t,n,o=e.data.deleted;o?($(">button",l).css("background-color",""),"Post"==e.data.type?(t=$("#post-like-"+e.data.likeableId).html(),$("#post-like-"+e.data.likeableId).html(parseInt(t)-1)):(t=$("#comment-like-"+e.data.likeableId).html(),$("#comment-like-"+e.data.likeableId).html(parseInt(t)-1))):($(">button",l).css("background-color","green"),"Post"==e.data.type?(n=$("#post-like-"+e.data.likeableId).html(),$("#post-like-"+e.data.likeableId).html(parseInt(n)+1)):(n=$("#comment-like-"+e.data.likeableId).html(),$("#comment-like-"+e.data.likeableId).html(parseInt(n)+1))),console.log(e),console.log(o)},error:function(e){console.log(e)}})})},t=function(){for(let n of $("#friends>p")){let t=$(">.friend-delete",n);$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:t.prop("href"),success:function(){$(n).remove()},error:function(e){console.log("error in friend deletion")}})})}};t();let r=$("#posts-container>li");for(let t of r){o($(" .delete-btn",t)),c($(">.likes-container",t));let e={_id:$(t).prop("id").slice(5)};i(e);let n=$(" .comment",t);for(let t of n){let e=$(" .delete-comment",t);null!=e&&(s(e),c($(">.comment-content>.likes-container",t)))}}}