class chatEngine{constructor(e,t,s,i){this.chatBox=$("#"+e),this.userEmail=t,this.userId=s.toString(),this.username=i,this.socket=io.connect("http://50.19.145.241.nip.io:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){function i(r,d){console.log("initiate chat");let l=$("#chat-container>div").first();function t(a,n){var t;890<$(window).width()?($("#chat-container").attr("friendId")&&$("#chat-container").attr("friendId").toString()==d.toString()||($.ajax({type:"get",url:"/message/loadMessage/"+d,success:function(s){console.log("entered again 20e",d);let i="";if(s.data.isValid){$(" .notification-badge",$(this)).remove(),$(l).css({"background-color":"#0A58CA",color:"white"}),$(" p",l).css("left","10px");let e;console.log("btn_source: ","sideBarMsgBtn"==n),"sideBarMsgBtn"==n?(e=$(" .profile-btn",$(a).parent()).text(),console.log($(" .profile-btn",$(a).parent()).text())):e=$(a).attr("username");let t=e+' <i class="fas fa-angle-down"></i>';$(" p",l).fadeOut(200,function(){$(this).html(t).fadeIn(500)});for(var o of s.data.messages)o.sentBy._id.toString()==r.userId.toString()?i+=`
                                            
                                            <li class="self-msg">
                                                <div class="username"><p>You</p></div>
                                                <div class="msg-content"><p>${o.message}</p></div>
                                            </li>
                                            
                                            
                                            `:i+=`
                                            
                                            <li class="user-msg">
                                                <div class="username"><p>${o.sentBy.name}</p></div>
                                                <div class="msg-content"><p>${o.message}</p></div>
                                            </li>               
                                            `;$("#chat-container .chats-container").html('<ul id="chats">'+i+`</ul>
                                        <a href="#last-msg" style="display:none;"></a>
                                        <form id="create-msg" method="post" action='/message/create'>
                                            <div id="input-msg"><input type="text" placeholder="text here..."  name="message"></div>
                                            <input name="sentTo" type="hidden" value="${d}">
                                            
                                            <div id="send-msg"><button type="submit"><i class="fas fa-angle-double-right"></i></button></div>
                                        </form>`),$("#chats li").last().attr("id","last-msg"),function(){const e=document.getElementById("chats");var t=document.getElementById("last-msg");t&&(e.scrollTop=t.offsetTop)}()}else window.location.href="/"}}),$("#chat-container").attr("friendId",d),$("#chat-container").attr("groupid",""),$("#chat-container").attr("type","friend")),1==e&&(t=r,$(document).on("submit",'div[type="friend"].chat-box #create-msg',function(e){e.preventDefault(),console.log($(this)[0]),console.log("$(formData).serialize(): ",$(this).serialize()),$.ajax({type:"post",url:"/message/create",data:$(this).serialize(),success:function(e){console.log(e.data),e.data.valid?(console.log("repeat"),console.log("data: ",e),$("#chats").append(`
                                
                                <li class="self-msg">
                                    <div class="username"><p>You</p></div>
                                    <div class="msg-content"><p>${e.data.message}</p></div>
                                </li>
                                
                                
                                `),$(document).ready(function(){$("#input-msg input").val("")}),t.socket.emit("message stored in db",{sentBy:e.data.sentBy,sentTo:e.data.sentTo,message:e.data.message,messageId:e.data.messageId})):window.location.href="/"}})}),e=0)):window.location.href="/message/messagepage/"+d}$(document).on("click",`#friends li[friendId="${d}"] .initiate-msg`,function(e){t(this,"sideBarMsgBtn")}),$(document).on("click",".sendMsg button",function(e){t(this,"profileMsgBtn")})}function o(n,t){let r=$("#chat-container>div").first();function s(o,a){var t;console.log("groupId",a),890<$(window).width()?($("#chat-container").attr("groupId")&&$("#chat-container").attr("groupId").toString()==a.toString()||($.ajax({type:"get",url:"/groups/loadMessage/"+a,success:function(t){console.log("entered again 20e",a);let s="";if(t.data.isValid){$(" .notification-badge",$(o)).remove(),$(r).css({"background-color":"#0A58CA",color:"white"}),$(" p",r).css("left","10px");let e;e=$(" .profile-btn",$(o).parent()).text(),e+=' <i class="fas fa-angle-down"></i>',$(" p",r).fadeOut(200,function(){$(this).html(e).fadeIn(500)});for(var i of t.data.messages)i.sentBy._id.toString()==n.userId.toString()?s+=`
                                            
                                            <li class="self-msg">
                                                <div class="username"><p>You</p></div>
                                                <div class="msg-content"><p>${i.message}</p></div>
                                            </li>
                                            
                                            
                                            `:s+=`
                                            
                                            <li class="user-msg">
                                                <div class="username"><p>${i.sentBy.name}</p></div>
                                                <div class="msg-content"><p>${i.message}</p></div>
                                            </li>               
                                            `;$("#chat-container .chats-container").html('<ul id="chats">'+s+`</ul>
                                        <a href="#last-msg" style="display:none;"></a>
                                        <form id="create-msg" method="post" action='/groups/Createmessage'>
                                            <div id="input-msg"><input type="text" placeholder="text here..."  name="message"></div>
                                            <input name="groupId" type="hidden" value="${a}">
                                            
                                            <div id="send-msg"><button type="submit"><i class="fas fa-angle-double-right"></i></button></div>
                                        </form>`),$("#chats li").last().attr("id","last-msg"),function(){const e=document.getElementById("chats");var t=document.getElementById("last-msg");t&&(e.scrollTop=t.offsetTop)}()}else window.location.href="/"}}),$("#chat-container").attr("groupId",a),$("#chat-container").attr("friendId",""),$("#chat-container").attr("type","group")),1==d&&(t=n,$(document).on("submit",'div[type="group"].chat-box #create-msg',function(e){e.preventDefault(),console.log($(this)[0]),console.log("$(formData).serialize(): ",$(this).serialize()),$.ajax({type:"post",url:"/groups/Createmessage",data:$(this).serialize(),success:function(e){console.log(e.data),e.data.valid?(console.log("repeat"),console.log("data: ",e),$("#chats").append(`
                                
                                <li class="self-msg">
                                    <div class="username"><p>You</p></div>
                                    <div class="msg-content"><p>${e.data.message}</p></div>
                                </li>
                                
                                
                                `),$(document).ready(function(){$("#input-msg input").val("")}),console.log("data.data.members",e.data.members),t.socket.emit("group message stored in db",{sentBy:e.data.sentBy,groupId:e.data.groupId,message:e.data.message,messageId:e.data.messageId,members:e.data.members})):window.location.href="/"}})}),d=0)):window.location.href="/groups/groupchatpage/"+t}$(document).on("click",`#Groups li[groupid="${t}"] .msg-add-friend`,function(e){s(this,t)})}function a(a){$(document).on("click",".notif-close-btn",function(e){console.log($(this).parent().parent());let t=this;console.log('$(this).parent().parent().attr("notif_uid"): ');var s=$(this).parent().parent().attr("notif_uid"),i=$(this).parent().parent().attr("postid");let o;"reqAccepted"==a?o=`/users/delete-notifs/${s}/${a}/null`:i&&(o=`/users/delete-notifs/${s}/${a}/`+i),$.ajax({type:"get",url:o,success:function(e){console.log($(t).parent().parent()),$(t).parent().parent().remove(),1==$("#notification-bell li").length&&$("#no_notifs").prop("class","")}})})}function t(){function t(e){let s=$(" .req-detail",$(e).parent().parent()).attr("userid");s=s||$(e).parent().attr("userid"),console.log("fromUserId: ",s),"accept"==$(e).attr("decision")?$.ajax({type:"post",url:"/users/friends/toggle/"+s,success:function(t){if(console.log("sucess:",t),$(`a[userid="${s}"].req-detail`).parent().parent().remove(),$("#all_users_id_"+s).remove(),$("#add-friend").html(`
                            
                            <button>
                            Message</button>
                            
                            `),$("#add-friend").attr("class","sendMsg"),!t.alreadyExists){let e;e=t.profile_pic?`<img src="${t.profile_pic}" alt="">`:'<i class="fas fa-user"></i>',$("#friends").prepend(`
                            
                                <li friendId="${s}" friendshipId="${t.friendshipId}">
                                    <div class="list-content-wrapper">
                                        <a href="/users/profile/${s}" class="profile-btn">
                                        
                                        
                                        <div class="img-container">
                                        ${e}
                                        </div>
                                        
                                        
                                        
                                        ${t.friendName}</a>
                                        <a class="msg-add-friend initiate-msg"><i class="fas fa-comment-dots"></i></a>
                                    </div>
                                    <div class="side-list-border"></div>
                                </li>
        
                                `),$("#profile-stats").append(`<div id="remove-friend" profileid="${s}"><a href="/users/friends/remove-friend/${s}/${n.userId}"><i class="fas fa-user-minus"></i></a></div>`),i(n,s),n.socket.emit("friend_request_accepted",{fromUserId:s,toUserId:n.userId,friendshipId:t.friendshipId});t=$("#friends-count div").last().html();console.log(typeof t),$("#friends-count div").last().html(+t+1)}console.log("$('#notification-bell li').length: ",$("#notification-bell li").length),1==$("#notification-bell li").length&&$("#no_notifs").prop("class","")}}):$.ajax({type:"get",url:"/users/friends/reject_req/"+s,success:function(){n.socket.emit("friend_request_rejected",{fromUserId:s,toUserId:n.userId}),$(`a[useridvalue='${s}']`).css("pointer-events",""),$(`a[userid="${s}"].req-detail`).parent().parent().remove(),$("#add-friend").html(`
                            
                                <button userIdValue=${s}>
                                Add friend</button>
                            
                            `),$("#add-friend").attr("class","toggleFriendReq"),1==$("#notification-bell li").length&&$("#no_notifs").prop("class","")}})}$(".req-decision button").click(function(e){t(this)}),$("#add-friend.acceptReject button").click(function(e){t(this)})}let n=this,e=1,d=1;this.socket.on("connect",function(){console.log("connection established using sockets!"),console.log("self.userId: ",n.userId),n.socket.emit("join_universal_room",{user_id:n.userId,universal_room:"universal_room"}),$(document).on("click","#users .msg-add-friend",function(e){e.preventDefault(),n.socket.emit("sendFriendReq",{fromUserId:n.userId,toUserId:$(this).attr("userIdValue")})}),$(document).on("click","#add-friend.toggleFriendReq button",function(e){e.preventDefault(),n.socket.emit("sendFriendReq",{fromUserId:n.userId,toUserId:$(this).attr("userIdValue")})}),$(document).on("click","#new-group",function(){$.ajax({type:"get",url:"/groups/allUsers",success:function(e){let t="";$("#CreategroupModal form").attr("action","/groups/create");for(var s of e.allUsers)s._id.toString()!=n.userId.toString()&&(t+=`
                            
                            
                                <li class="list-group-item form-check" aria-current="true">
        
                                    <input type="checkbox" id="grp_user_${s._id}" class="check_box" name="groupMembers" value="${s._id}">
                                    <label class="form-check-label" for="grp_user_${s._id}">
                                    
                                        ${s.name}
                                    
                                    </label>
                                </li>
                                
                                
                                `);console.log("data.allUsers",e.allUsers),$('#CreategroupModal button[type="submit"]').html("Create Group"),$("#CreategroupModal .list-group").html(t),$("#CreategroupModal .create-group-form .group-section-heading").html("group Details")}})}),$(document).on("submit","#CreategroupModal form",function(e){var t=[];$("#CreategroupModal .list-group input:checked").each(function(){console.log($(this).attr("value")),t.push($(this).attr("value"))});var s=$(".group-name input").val(),i=$('#CreategroupModal input[name="admin"]').val();n.socket.emit("new group created",{members:t,groupName:s,admin:i})}),n.socket.on("universal room joined",function(e){console.log("data.userfriendId: ",e.userfriendId);for(var t of e.userfriendId)i(n,t);console.log("data.joinedGroups",e.joinedGroups);for(var s of e.joinedGroups)o(n,s._id.toString())}),n.socket.on("added to a group",function(e){console.log("added to a group",e.groupName),$("#notification-bell ul").append(`
                
                                
                <li type="group-notifs"><div class="dropdown-item other-notifs">
                    <div class="req-detail">
                        <p>you have been added to a group ${e.groupName} by <a href="/users/profile/${e.adminId}">${e.adminName}</a> click <a href="/">here</a> to see changes
                        </p>
                    </div>
                    <div class="req-decision notif-close-btn">
                            <i class="fas fa-times"></i>
                    </div>
       
                </li>
                
                
                `),$(document).on("click","#notification-bell ul li .notif-close-btn",function(e){"group-notifs"==$(this).parent().attr("type")&&$(this).parent().remove()})}),n.socket.on("friend_request_recieved",function(e){console.log("friend request recieved",e),$("#notification_btn").append(`
                <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    <span class="visually-hidden">New alerts</span>
                </span>
                `),$("#notification-bell ul").prepend(`
                
                <li type="friend-request"><div class="dropdown-item request-drpdwn">


                <a class="req-detail" userid="${e.fromUser}" href="/users/profile/${e.fromUser}">
                <div>
                    <img src="${e.profile_pic}" alt="">
                </div>
                
                <p>${e.username}</p>
                </a>
                <div class="req-decision">
                <button decision="accept"><i class="far fa-check-circle fa-sm"></i></button>
                <button decision="reject"><i class="far fa-times-circle fa-sm"></i></button>
                </div>
                </div></li>
                `),$("#add-friend").attr("class","acceptReject"),$("#add-friend").html(`
                
                <button  userIdValue="${e.fromUser}" decision="accept">
                    <i class="far fa-check-circle fa-sm"></i>
                </button>
                <button  userIdValue="${e.fromUser}" decision="reject">
                    <i class="far fa-times-circle fa-sm"></i>
                </button>
                
                `),$(`a[useridvalue='${e.fromUser}']`).css("pointer-events","none"),$("#no_notifs").prop("class","hidden"),t()}),n.socket.on("friend_request_sent",function(e){console.log("friend request sent"),console.log(e.toUser),console.log($(`a[userIdValue="${e.toUser}"]`)[0]),$($(`a[userIdValue="${e.toUser}"]`)[0]).html('<i class="fas fa-check"></i>'),$("#add-friend").html(`
                
                <button userIdValue=${e.toUser}>
                Pending</button>
            
                
                `),$("#add-friend").attr("class","toggleFriendReq")}),n.socket.on("friend_request_cancelled_reciever",function(e){$(`a[userid="${e.fromUser}"].req-detail`).parent().parent().remove(),$("#notification_btn .notification-badge").remove(),1==$("#notification-bell li").length&&$("#no_notifs").prop("class",""),$(`a[useridvalue='${e.fromUser}']`).css("pointer-events",""),console.log("xyz"),$("#add-friend").html(`
                    
                    <button userIdValue=${e.fromUser}>
                    Add friend</button>
                `),$("#add-friend").attr("class","toggleFriendReq")}),n.socket.on("friend_request_cancelled_sender",function(e){$(`a[userIdValue="${e.toUser}"]`).html('<i class="fas fa-user-plus"></i>'),$("#add-friend").html(`
                
                <button userIdValue="${e.toUser}">
                Add friend</button>
                
                `),$("#add-friend").attr("class","toggleFriendReq")}),n.socket.on("request accepted by friend",function(e){console.log("this: ",this),console.log("data.toUserId: ",e.toUser),$("#all_users_id_"+e.toUser).remove();let t;t=e.profile_pic?`<img src="${e.profile_pic}" alt="">`:'<i class="fas fa-user"></i>',$("#friends").prepend(`
                            
                <li friendId="${e.toUser}" friendshipId="${e.friendshipId}">
                    <div class="list-content-wrapper">
                        <a href="/users/profile/${e.toUser}" class="profile-btn">
                        
                        <div class="img-container">
                            ${t}
                        </div>
                        
                        ${e.toUserName}</a>
                        <a class="msg-add-friend initiate-msg"><i class="fas fa-comment-dots"></i></a>
                    </div>
                    <div class="side-list-border"></div>
                </li>
                                        

                `),$("#notification-bell button").append(`

                <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    <span class="visually-hidden">New alerts</span>
                </span>
                `),$("#notification-bell ul").prepend(`
                
                
                    <li type="other-notifs" notif_uid="${e.toUser}"><div class="dropdown-item other-notifs">
                        <div class="req-detail">
                            <p><a href="/users/profile/${e.toUser}">${e.toUserName}</a> has accepted your friend request</p>
                        </div>
                        <div class="req-decision notif-close-btn">
                                 <i class="fas fa-times"></i>
                        </div>
               
                    </li>
                `),$("#profile-stats").append(`<div id="remove-friend" profileid="${e.toUser}"><a href="/users/friends/remove-friend/${e.toUser}/${n.userId}"><i class="fas fa-user-minus"></i></a></div>`);var s=$("#friends-count div").last().html();$("#friends-count div").last().html(+s+1),$("#add-friend").attr("class","sendMsg"),$("#add-friend").html(`
                
                    <button userIdValue="${e.toUser}">
                    Message</button>
                `),a("reqAccepted"),$("#no_notifs").prop("class","hidden"),i(n,e.toUser),$("#add-friend").html(`
                <button userIdValue="${e.toUser}">
                    Message</button>
                `),$("#add-friend").attr("class","sendMsg")}),n.socket.on("request rejected by user",function(e){$(`a[useridvalue="${e.toUser}"]`).html('<i class="fas fa-user-plus"></i>'),$("#add-friend").html(`
                
                <button userIdValue="${e.toUser}">
                Add friend</button>
                
                `),$("#add-friend").attr("class","toggleFriendReq")}),n.socket.on("friend removed",function(e){console.log("friend removed"),$("#remove-friend").remove(),$(`#friends li[friendId="${removedTo}"]`).remove(),$("#add-friend").attr("class","toggleFriendReq"),$("#add-friend").html(`
                    <button  userIdValue="${e.removedBy}">
                    Add friend
                    </button>
                `);e=$("#friends-count div").last().html();console.log(typeof e),$("#friends-count div").last().html(+e-1),$("#add-friend").attr("class","toggleFriendReq")}),n.socket.on("new message recieved",function(e){$("#chat-container").attr("friendid")&&$("#chat-container").attr("friendid").toString()==e.sentBy.toString()?($("#chats").append(`
                        
                        <li class="user-msg">
                            <div class="username"><p>${e.senderName}</p></div>
                            <div class="msg-content"><p>${e.message}</p></div>
                        </li>
                        
                        
                    `),$.ajax({type:"post",url:"/message/seen/"+e.messageId,success:function(){console.log("xyz: ",$(`li[friendid="${e.sentBy}"] .notification-badge`)),console.log(`li[friendid="${e.sentBy}"`),console.log("data: ",e),$(`li[friendid="${e.sentBy}"] .notification-badge`).remove()}})):$(`#friends li[friendid=${e.sentBy}] .msg-add-friend`).append(`
                        
                            <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                                <span class="visually-hidden">New alerts</span>
                            </span>
                        
                        `)}),n.socket.on("new group message recieved",function(e){$("#chat-container").attr("groupid")&&$("#chat-container").attr("groupid").toString()==e.groupId.toString()?e.sentBy.toString()!=n.userId.toString()&&($("#chats").append(`
                            
                            <li class="user-msg">
                                <div class="username"><p>${e.senderName}</p></div>
                                <div class="msg-content"><p>${e.message}</p></div>
                            </li>
                            
                            
                        `),console.log("new group message recieved"),$.ajax({type:"post",url:"/groups/seenMessage/"+e.messageId,success:function(){console.log("xyz: ",$(`li[groupid="${e.groupId}"] .notification-badge`)),console.log("data: ",e),$(`li[friendid="${e.sentBy}"] .notification-badge`).remove()}})):$(`#Groups li[groupid=${e.groupId}] .msg-add-friend`).append(`
                        
                            <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                                <span class="visually-hidden">New alerts</span>
                            </span>
                        
                        `)}),n.socket.on("someone liked your post",function(e){console.log("someone liked your post"),$("#notification-bell button").append(`

                <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    <span class="visually-hidden">New alerts</span>
                </span>
                `),$("#notification-bell ul").prepend(`
                
                
                    <li type="other-notifs" notif_uid="${e.likedBy}" postid="${e.postid}"><div class="dropdown-item other-notifs">
                        <div class="req-detail">
                            <p><a href="/users/profile/${e.likedBy}">${e.likedByName}</a> liked your <a href="#post-${e.assetId}">post</a></p>
                        </div>
                        <div class="req-decision notif-close-btn">
                                 <i class="fas fa-times"></i>
                        </div>
                    </li>
                `),a("post_liked"),$("#no_notifs").prop("class","hidden")}),$(document).on("click","#chat-container .heading i",function(e){e.preventDefault(),console.log($(this)),console.log("$('#chat-container .chats-container'): ",$("#chat-container .chats-container")),$("#chat-container .chats-container").toggleClass("minimize-chat-body"),$("#chat-container").toggleClass("minimize-chat-container"),$(this).toggleClass("fa-angle-up fa-angle-down")}),a("reqAccepted"),a("post_liked"),t(),console.log($("#remove-friend")),$(document).on("click","#remove-friend",function(e){e.preventDefault(),$.ajax({type:"get",url:$(" a",$(this)).attr("href"),success:function(e){let t;t=e.removedUserAvatar?`<img src="${e.removedUserAvatar}>" alt="">`:'<i class="fas fa-user"></i>',n.socket.emit("friend removed",{removedBy:n.userId,removedTo:e.removedUserId}),$("#remove-friend").remove(),$(`#friends li[friendid="${e.removedUserId}"]`).remove(),$("#users").prepend(`
                        
                            <li id="all_users_id_${e.removedUserId}">
                                <div class="list-content-wrapper">
                                <a href="/users/profile/${e.removedUserId}" class="profile-btn">
                                    
                                    <div class="img-container">
                                    ${t}
                                    </div>
                                    
                                    ${e.removedUserName}
                                
                                </a>
                                <a href="" class="msg-add-friend" userIdValue="${e.removedUserId}">
                                <i class="fas fa-user-plus"></i>
                                </a>
                                </div>
                                <div class="side-list-border"></div>
                            </li>
                        `);e=$("#friends-count div").last().html();console.log(typeof e),$("#friends-count div").last().html(+e-1),$("#add-friend").attr("class","toggleFriendReq"),$("#add-friend button").html("Add friend"),$("#create-msg")}})}),$(document).on("click",".profile-btn",function(e){if("group"==$(this).attr("type")){var t=$(this).parent().parent().attr("groupid");console.log("groupId: ",t);let e=$(this).attr("admin");$("#CreategroupModal form").attr("action","/groups/update/"+t),$.ajax({type:"get",url:"/groups/info/"+t,success:function(t){if(e.toString()==n.userId.toString()){let e=`
                                
                                <li class="list-group-item" aria-current="true">

                                    <p>
                                        ${t.data.group.admin.name}(admin)(You)
                                    </p>
                                </li>`;for(var s of t.data.group.users)s._id.toString()!=n.userId.toString()&&(e+=`
                                        <li class="list-group-item form-check" aria-current="true">

                                            <input type="checkbox" id="grp_user_${s._id}" class="check_box" name="groupMembers" value="${s._id}" checked>
                                            <label class="form-check-label" for="grp_user_${s._id}">
                                            
                                                ${s.name}
                                            
                                            </label>
                                        </li>
                                        
                                        `);for(var i of t.data.restUsers)e+=`
                                    <li class="list-group-item form-check" aria-current="true">

                                        <input type="checkbox" id="grp_user_${i._id}" class="check_box" name="groupMembers" value="${i._id}">
                                        <label class="form-check-label" for="grp_user_${i._id}">
                                        
                                            ${i.name}
                                        
                                        </label>
                                    </li>
                                    
                                    `;$("#CreategroupModal .list-group").html(`
                                
                                    ${e}
                                `),console.log("group: ",t.data.group.description),$("#CreategroupModal .group-name input").val(t.data.group.name),console.log($("#CreategroupModal .group-desc input")),$("#CreategroupModal .group-desc input").val(t.data.group.description),$("#CreategroupModal .group-profile-pic img").attr("src",t.data.group.groupPic),$("#CreategroupModal .create-group-form .group-section-heading").html("group Details"),$("#groupModalArea").html("Edit Group"),$('#CreategroupModal button[type="submit"]').html("Edit Group")}else{let e=`
                                
                                <li class="list-group-item" aria-current="true">

                                    <p>
                                        ${t.data.group.admin.name}(admin)
                                    </p>
                                </li>
                                `;for(var o of t.data.group.users)o._id.toString()==n.userId.toString()?e+=`
                                        <li class="list-group-item" aria-current="true">
    
                                            <p>
                                                ${o.name}(You)
                                            </p>
                                        </li>
                                        
                                        `:e+=`
                                        <li class="list-group-item" aria-current="true">
    
                                            <p>
                                                ${o.name}
                                            </p>
                                        </li>
                                        
                                        `;$("#ShowGroupModal .list-group").html(`
                                
                                    ${e}
                                `),console.log("group: ",t.data.group.description),$("#ShowGroupModal .group-name input").val(t.data.group.name),console.log($("#ShowGroupModal .group-desc input")),$("#ShowGroupModal .group-desc input").attr("value",t.data.group.description),$("#ShowGroupModal .group-profile-pic img").attr("src",t.data.group.groupPic)}}})}}),$("#notification_btn").click(function(e){$("#notification_btn .notification-badge").remove()});let s=$(".post");for(var e of s){e=$(" .like-btn",$(e));console.log(e);let t=1;$(e).on("click",function(e){1==t&&($(document).on("click",".popover-body>div",function(e){"unlike"!=$(this).attr("id")&&n.socket.emit("post liked by user",{likedBy:n.userId,assetId:$(s).attr("id").slice(5)})}),t=0)})}})}}
