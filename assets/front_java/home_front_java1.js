//wwhen the data gets submitted from the ejs file the control comes to this connected js file..here we first of all 
// select the form tag from dom 
{
    //method to post data from the form using ajax
    let createPost=function(){

        let newPostForm=$('#new-post-form');


        newPostForm.submit(function(e){

            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                // sending data to backend
                data: newPostForm.serialize(),
                // above 'data' and below 'data' are different
                success: function(data){
                    // recieved data from backend
                    let newPost=new newPostDom(data.data.post,data.data.username);
                    $('#posts-container').prepend(newPost);
                    flashFunc(data.data.flash);
                    commentCreate(data.data.post);
                    //notice here we below i have put an space before .delete-btn which signifies that this is inside 
                    //the newPost dom
                    deletePost($(' .delete-btn',newPost));
                    likeHandler($('>.likes-container',newPost));
                },
                error: function(error){
                    console.log(error.responseText);
                } 
            });
        });
            

    }

    let newPostDom=function(post,username){
        return $(`
        <li id="post-${post._id}" class="post"><small>
                <a href="posts/destroy/${post._id}" class="delete-btn">x</a>
            </small>
            <h4>${username}</h4>
            ${ post.content } 
            
            <br><br>
            <form class="likes-container">
                <input type="hidden" name="likeableId" value="${post._id}">
                <input type="hidden" name="type" value="Post">
                <button type="submit">&#128077;</button>
                <p>Likes: <span id="post-like-${post._id}">${post.likes.length}</span> </p>
            </form>
            <br><br>
            <p>comments:</p>
        
            <ul id="comment-list-${post._id}" class="comments">

            </ul>
                                             
            <form action="/comment/create" method="post" id="comment-create-${post._id}">
        
                <textarea name="comment" cols="30" rows="3" placeholder="comment.."></textarea>
                <input type="hidden" name="postid" value="${post._id}">
                <input type="submit" value="post-comment">
                
            </form>
            <p>--------------------------------------------------------------------------</p>
            </li>
        
        
        `)
    }

    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
            //line below :this is to prevent the default behaviour which was to reload the whole page again
            e.preventDefault();

            $.ajax({

                type:'get',
                url:$(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    flashFunc(data.data.flash);
                },
                error: function(error){
                    console.log(error.responseText);
                }
            });

        });

        

    }
    
    
    let flashFunc=function(message){

        new Noty({

            theme: 'relax',
            text: `${message}`,
            type: 'success',
            layout: 'topRight',
            timeout: 1500


        }).show();
    }
    let newCommentDom=function(comment,username){

        return $(`
        
            <li id="comment-${comment._id}" class="comment">
                <small>
                    <a href="comment/destroy/${comment._id }" class="delete-comment">x</a>
                </small>
                <div class="comment-content">
                    <p><h4>${username}</h4></p>
                    <p>-${comment.content}</p>
                    <form class="likes-container">
                        <input type="hidden" name="likeableId" value="${ comment._id }">
                        <input type="hidden" name="type" value="Comment">
                        <button type="submit">&#128077;</button>
                        <p>Likes: <span id="comment-like-${comment._id}">${comment.likes.length}</span> </p>
                    </form>
                </div>

                
            </li>
        
        `)



    }
    let commentCreate=function(post){
        let newComment=$(`#comment-create-${post._id}`);

        newComment.submit(function(e){

            e.preventDefault();

            $.ajax({

                type:'post',
                url: '/comment/create',
                data:newComment.serialize(),
                success: function(data){
                    let list=$(`#comment-list-${post._id}`);
                    let newComment=newCommentDom(data.data.comment,data.data.username);
                    $(list).prepend(newComment);
                    flashFunc(data.data.flash);
                    deleteComment($(' .delete-comment',newComment));
                    likeHandler($('>.comment-content>.likes-container',newComment));
                },
                error: function(error){
                    console.log(error.responseText);
                }


            });
        });

    }

    let deleteComment=function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({

                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.commentId}`).remove();
                    flashFunc(data.data.flash);
                },
                error: function(error){
                    console.log(error);
                }
            });
        });
    }
    createPost();

    let likeHandler=function(likeContainer){

        $(likeContainer).submit(function(e){
            e.preventDefault()
            var values=$(this).serialize();
            
            $.ajax({
                type:'post',
                url:'/likes/toggle/?'+values,
                success: function(data){
                    let deleted=data.data.deleted;
                    
                    if(deleted){
                        $('>button',likeContainer).css('background-color','');
                        if(data.data.type=='Post'){
                            let value=$(`#post-like-${data.data.likeableId}`).html();
                            
                            $(`#post-like-${data.data.likeableId}`).html(parseInt(value)-1);

                        }else{
                            let value=$(`#comment-like-${data.data.likeableId}`).html();
                            $(`#comment-like-${data.data.likeableId}`).html(parseInt(value)-1);
                        }
                    }else{
                        $('>button',likeContainer).css('background-color','green');
                        if(data.data.type=='Post'){
                            let value=$(`#post-like-${data.data.likeableId}`).html();
                            $(`#post-like-${data.data.likeableId}`).html(parseInt(value)+1);
                        }else{
                            let value=$(`#comment-like-${data.data.likeableId}`).html();
                            $(`#comment-like-${data.data.likeableId}`).html(parseInt(value)+1);
                        }

                    }
                    console.log(data);
                    console.log(deleted);
                },error:function(err){
                    console.log(err);
                }
            });



            
        });
    }

    // deleting a friend from the home page itself
    let delete_friend=function(){

        let friends=$('#friends>p');

        for(let friend of friends){
            let del_btn=$('>.friend-delete',friend);
            $(del_btn).click(function(e){
                e.preventDefault();
                $.ajax({

                    type:'get',
                    url:del_btn.prop('href'),
                    success:function(){
                        $(friend).remove();
                    },
                    error:function(err){
                        console.log('error in friend deletion');
                    }

                });

            });

        }
    }
    delete_friend();
    let postList=$('#posts-container>li');
    for(let post of postList){
        deletePost($(' .delete-btn',post));
        likeHandler($('>.likes-container',post));
        // likeHandler($('>.likes-container',newPost));
        let postdata={_id:$(post).prop('id').slice(5)}
        commentCreate(postdata);
        // console.log($(post).attr('id'));
        // console.log($(post).attr('id').slice(5));
        let comments=$(' .comment',post);
        for(let comment of comments){
            let delete_btn=$(' .delete-comment',comment);
            
            if(delete_btn!=null){
                deleteComment(delete_btn);
                likeHandler($('>.comment-content>.likes-container',comment));
            }
            
        }
    }
}