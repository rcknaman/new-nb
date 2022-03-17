class chatEngine{constructor(e,s,r,t){this.chatBox=$("#"+e),this.userEmail=s,this.userId=r.toString(),this.username=t,this.socket=io.connect("http://50.19.145.241.nip.io:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){function s(){1==t&&($(document).on("click",".acceptReject button",function(e){console.log("hello"),function(e){let s=$(e).parent().attr("userid");console.log("fromUserId: ",s),"accept"==$(e).attr("decision")?$.ajax({type:"post",url:"/users/friends/toggle/"+s,success:function(e){console.log("sucess:",e),$("#user-"+s).remove(),e.alreadyExists||r.socket.emit("friend_request_accepted",{fromUserId:s,toUserId:r.userId,friendshipId:e.friendshipId})}}):$.ajax({type:"get",url:"/users/friends/reject_req/"+s,success:function(){r.socket.emit("friend_request_rejected",{fromUserId:s,toUserId:r.userId}),$(`#user-${s} .acceptReject`).remove(),$(`#user-${s} .msg-add-friend`).remove(),$(`#user-${s} .list-content-wrapper`).append(`
                            
                                <a class="msg-add-friend initiate-msg" href="" userIdValue="${s}">
                                    <i class="fas fa-user-plus"></i>
                                </a>
                            `)}})}(this)}),t=0)}let r=this,t=1;this.socket.on("connect",function(){console.log("connection established using sockets!"),console.log("self.userId: ",r.userId),r.socket.emit("join_universal_room",{user_id:r.userId,universal_room:"universal_room"}),$(document).on("click",".msg-add-friend",function(e){e.preventDefault(),r.socket.emit("sendFriendReq",{fromUserId:r.userId,toUserId:$(this).attr("userIdValue")})}),r.socket.on("friend_request_sent",function(e){console.log("friend request sent"),console.log(e.toUser),console.log($(`a[userIdValue="${e.toUser}"]`)[0]),$($(`a[userIdValue="${e.toUser}"]`)[0]).html('<i class="fas fa-check"></i>')}),r.socket.on("friend_request_recieved",function(e){console.log("friend_request_recieved"),$(`#user-${e.fromUser} a.msg-add-friend`).remove(),$(`#user-${e.fromUser} .list-content-wrapper`).append(`<div class='acceptReject' userid="${e.fromUser}">
                
                    <button decision="accept"><i class="far fa-check-circle fa-sm"></i></button>
                    <button decision="reject"><i class="far fa-times-circle fa-sm"></i></button>
                
                
                </div>`),s(t)}),r.socket.on("friend_request_cancelled_sender",function(e){$($(`a[userIdValue="${e.toUser}"]`)[0]).html('<i class="fas fa-user-plus"></i>')}),r.socket.on("friend_request_cancelled_reciever",function(e){$(`#user-${e.fromUser} .acceptReject`).remove(),$(`#user-${e.fromUser} .list-content-wrapper`).append(`
                
                <a class="msg-add-friend initiate-msg" href="" userIdValue="${e.fromUser}">
                    <i class="fas fa-user-plus"></i>
                </a>
                `)}),r.socket.on("request accepted by friend",function(e){$("#user-"+e.toUser).remove()}),s()})}}
