// socket for front end side
// it is known as subscriber file

class chatEngine{

    constructor(ChatBoxId,useremail,userid,username){

        this.chatBox=$(`#${ChatBoxId}`);
        this.userEmail=useremail;
        this.userId=userid.toString();
        this.username=username;
        this.socket=io.connect('http://localhost:5000');
        
        if(this.userEmail){
            this.connectionHandler();
        }
        // console.log('user._id.toString(): ',user._id.toString());
    }

    connectionHandler(){


        let self=this;
        let flag=1;//flag for handling nested click event here in 'initialchat'
        let initiateChat = function (self,friendId) {
            console.log('initiate chat');
            let chatHeader = $('#chat-container>div').first();
            $(document).on('click',`#friends li[friendId="${friendId}"] .initiate-msg`,function (e) {
    

                if($(window).width()>890){




                    e.preventDefault();
                    $(' .notification-badge',$(this)).remove();
                    $(chatHeader).css({
                        'background-color': '#0A58CA',
                        'color': "white"
                    });
                    $(' p', chatHeader).css('left', '10px');
                    let userName = $(' .profile-btn', $(this).parent()).text()+' '+'<i class="fas fa-angle-down"></i>';
                    $(' p', chatHeader).fadeOut(200, function () {
                        $(this).html(userName).fadeIn(500);
                    });
                    // console.log(`$('#chat-container').attr('friendId'): `,!$('#chat-container').attr('friendId'));
                    if(!$('#chat-container').attr('friendId') || $('#chat-container').attr('friendId').toString()!=friendId.toString()){
    
                        $.ajax({
    
                            type:'get',
                            url:`/message/loadMessage/${friendId}`,
                            success:function(data){
                                console.log('entered again 20e',friendId);
                                let messageDom=``;
    
                                for(let message of data.data.messages){
    
                                    if(message.sentBy._id.toString()==self.userId.toString()){
                                        messageDom+=`
                                        
                                        <li class="self-msg">
                                            <div class="username"><p>You</p></div>
                                            <div class="msg-content"><p>${message.message}</p></div>
                                        </li>
                                        
                                        
                                        `
                                    }
                                    else{
                                        messageDom+=`
                                        
                                        <li class="user-msg">
                                            <div class="username"><p>${message.sentBy.name}</p></div>
                                            <div class="msg-content"><p>${message.message}</p></div>
                                        </li>               
                                        `
                                    }
    
    
                                }
    
    
                                $('#chat-container .chats-container').html(
        
                                    `<ul id="chats">`
    
                                    +messageDom+
    
    
    
                                    `</ul>
                                    <a href="#last-msg" style="display:none;"></a>
                                    <form id="create-msg" method="post" action='/message/create'>
                                        <div id="input-msg"><input type="text" placeholder="text here..."  name="message"></div>
                                        <input name="sentTo" type="hidden" value="${friendId}">
                                        
                                        <div id="send-msg"><button type="submit"><i class="fas fa-angle-double-right"></i></button></div>
                                    </form>`
                    
                    
                                )
    
                                $('#chats li').last().attr('id','last-msg');
    
                                                    
                                function scrollToBottom(){
                                    const messages = document.getElementById('chats');
                                    const messagesid = document.getElementById('last-msg');  
                                    messages.scrollTop = messagesid.offsetTop;
                                }
                                
                                scrollToBottom();
    
                            }
    
                        });
    
                        // $("#chats").animate({ scrollTop: 20000000 }, "slow");
                        $('#chat-container').attr('friendId',friendId);
                    }
     
                    if(flag==1){
                        $(document).on('click',`#chat-container .heading i`,function(e){
                            e.preventDefault();
                            console.log($(this));
                            console.log(`$('#chat-container .chats-container'): `,$('#chat-container .chats-container'));
                            $(`#chat-container .chats-container`).toggleClass('minimize-chat-body');
                            $("#chat-container").toggleClass('minimize-chat-container');
                            $(this).toggleClass("fa-angle-up fa-angle-down");
                        });
                        sendingMsg(self);
                        flag=0;
                    }

                }else{



                    window.location.href=`/message/messagepage/${friendId}`;




                }




            });

        }

        let deleteNotif=function(){
            $('.notif-close-btn').on('click',function(e){

                
                console.log($(this).parent().parent());
                let notif_self=this;
                console.log('$(this).parent().parent().attr("notif_uid"): ',$(this).parent().parent().attr('notif_uid'));
                $.ajax({

                    type:'get',
                    url:`/users/delete-notifs/${$(this).parent().parent().attr('notif_uid')}`,
                    success:function(data){
                        console.log($(notif_self).parent().parent());
                        $(notif_self).parent().parent().remove();
                        if($('#notification-bell li').length==1){
                            $('#no_notifs').prop('class','');
                        }
                    }
                })
            });
        }
        let acceptRejectBtn=function(){


            function helper(curr){
                let fromUserId=$(' .req-detail',$(curr).parent().parent()).attr('userid');
                if(!fromUserId){
                    fromUserId=$(curr).parent().attr('userid')
                }
                console.log('fromUserId: ',fromUserId);
                let decision=$(curr).attr('decision');

                // when clicking on accept button
                if(decision=='accept'){

                    $.ajax({

                        type:'post',
                        url:`/users/friends/toggle/${fromUserId}`,
                        success:function(data){
                            console.log('sucess:' ,data);
                            $(`div[userid="${fromUserId}"].req-detail`).parent().parent().remove();
                            $(`#all_users_id_${fromUserId}`).remove();
                            $('#add-friend').html(`
                            
                            <button>
                            Message</button>
                            
                            `)
                            $('#add-friend').attr('class','sendMsg');

                            if(!data.alreadyExists){
                                $('#friends').prepend(`
                            
                                <li friendId="${fromUserId}" friendshipId="${data.friendshipId}">
                                    <div class="list-content-wrapper">
                                        <a href="" class="profile-btn">${data.friendName}</a>
                                        <a class="msg-add-friend initiate-msg"><i class="fas fa-comment-dots"></i></a>
                                    </div>
                                    <div class="side-list-border"></div>
                                </li>
        
                                `);
                                initiateChat(self,fromUserId);
                                self.socket.emit('friend_request_accepted',{
                                    fromUserId:fromUserId,
                                    toUserId:self.userId,
                                    friendshipId:data.friendshipId
                                });
                                let friendCount=$('#friends-count div').last().html();
                                console.log(typeof(friendCount));
                                $('#friends-count div').last().html(+friendCount +1);
                            }
                            console.log(`$('#notification-bell li').length: `,$('#notification-bell li').length);
                            if($('#notification-bell li').length==1){
                                $('#no_notifs').prop('class','');
                            }
                        }
        
        
                    });
                    // when clicking on reject button
                }else{

                    $.ajax({

                        type:'get',
                        url:`/users/friends/reject_req/${fromUserId}`,
                        success:function(){

                            self.socket.emit('friend_request_rejected',{
                                fromUserId:fromUserId,
                                toUserId:self.userId
                            });
                            $(`a[useridvalue='${fromUserId}']`).css('pointer-events','none');

                            $(`div[userid="${fromUserId}"].req-detail`).parent().parent().remove();

                            $('#add-friend').html(`
                            
                                <button userIdValue=${fromUserId}>
                                Add friend</button>
                            
                            `)
                            $('#add-friend').attr('class','toggleFriendReq');


                            if($('#notification-bell li').length==1){
                                $('#no_notifs').prop('class','');
                            }
                        }

                    })


                }
            }



            $(`.req-decision button`).click(function(e){
                helper(this);
            });
            $(`#add-friend.acceptReject button`).click(function(e){
                helper(this);
            });

        }
        let sendingMsg=function(self){

            $(document).on('submit','#create-msg',function(e){
                
                e.preventDefault()
                console.log($(this)[0]);
                console.log('$(formData).serialize(): ',$(this).serialize());
                $.ajax({

                    type:'post',
                    url:'/message/create',
                    data:$(this).serialize(),
                    success:function(data){
                        console.log('repeat');
                        console.log('data: ',data);
                        $('#chats').append(

                            `
                            
                            <li class="self-msg">
                                <div class="username"><p>You</p></div>
                                <div class="msg-content"><p>${data.data.message}</p></div>
                            </li>
                            
                            
                            `);
                        $(document).ready(function(){
                            $('#input-msg input').val('');
                        });

                        self.socket.emit('message stored in db',{
                            sentBy:data.data.sentBy,
                            sentTo:data.data.sentTo,
                            message:data.data.message,
                            messageId:data.data.messageId
                        });


                    }


                });



            });



        }
        this.socket.on('connect',function(){

            console.log(
                'connection established using sockets!'
            );
                console.log('self.userId: ',self.userId);
            self.socket.emit('join_universal_room',{

                user_id:self.userId,
                universal_room:'universal_room'
            });

            $(document).on('click','#users .msg-add-friend',function(e){

                e.preventDefault();
                self.socket.emit('sendFriendReq',{
                    fromUserId:self.userId,
                    toUserId:$(this).attr('userIdValue')
                })


            });
            $(document).on('click','#add-friend.toggleFriendReq button',function(e){

                e.preventDefault();
                self.socket.emit('sendFriendReq',{
                    fromUserId:self.userId,
                    toUserId:$(this).attr('userIdValue')
                });



            });
            // when the request is recieved by end user
            self.socket.on('universal room joined',function(data){

                console.log('data.userfriendId: ',data.userfriendId);
                for(let friend of data.userfriendId){
                    initiateChat(self,friend);
                }

            });
            self.socket.on('friend_request_recieved',function(data){
                console.log('friend request recieved',data);
                $('#notification_btn').append(`
                <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    <span class="visually-hidden">New alerts</span>
                </span>
                `);
                $('#notification-bell ul').prepend(`
                
                <li type="friend-request"><div class="dropdown-item request-drpdwn">


                <div class="req-detail" userid="${data.fromUser}">
                <img src="" alt="">
                <p>${data.username}</p>
                </div>
                <div class="req-decision">
                <button decision="accept"><i class="far fa-check-circle fa-sm"></i></button>
                <button decision="reject"><i class="far fa-times-circle fa-sm"></i></button>
                </div>
                </div></li>
                `)

                $('#add-friend').attr('class','acceptReject');
                $('#add-friend').html(`
                
                <button  userIdValue="${data.fromUser}" decision="accept">
                    <i class="far fa-check-circle fa-sm"></i>
                </button>
                <button  userIdValue="${data.fromUser}" decision="reject">
                    <i class="far fa-times-circle fa-sm"></i>
                </button>
                
                `)


                $(`a[useridvalue='${data.fromUser}']`).css('pointer-events','none');
                $('#no_notifs').prop('class','hidden');
                acceptRejectBtn();

            });

            // while sending friend request
            self.socket.on('friend_request_sent',function(data){
                console.log('friend request sent');
                console.log(data.toUser);
                console.log($(`a[userIdValue="${data.toUser}"]`)[0]);
                $($(`a[userIdValue="${data.toUser}"]`)[0]).html('<i class="fas fa-check"></i>');
                $('#add-friend').html(`
                
                <button userIdValue=${data.toUser}>
                Pending</button>
            
                
                `);
                $('#add-friend').attr('class','toggleFriendReq');
            });


            // toggling between sending the friend request and taking it back---
            self.socket.on('friend_request_cancelled_reciever',function(data){


                $(`div[userid="${data.fromUser}"].req-detail`).parent().parent().remove();
                $('#notification_btn .notification-badge').remove();
                if($('#notification-bell li').length==1){
                    $('#no_notifs').prop('class','');
                }
                $(`a[useridvalue='${data.fromUser}']`).css('pointer-events','');
                console.log('xyz');
                $('#add-friend').html(`
                    
                    <button userIdValue=${data.fromUser}>
                    Add friend</button>
                `);
                $('#add-friend').attr('class','toggleFriendReq');
            })
            self.socket.on('friend_request_cancelled_sender',function(data){

                $(`a[userIdValue="${data.toUser}"]`).html('<i class="fas fa-user-plus"></i>');
                $('#add-friend').html(`
                
                <button userIdValue="${data.toUser}">
                Add friend</button>
                
                `);       
                $('#add-friend').attr('class','toggleFriendReq');       
            });
// --------------------------------------------


            // when clicking on accept or reject button
           
            self.socket.on('request accepted by friend',function(data){
                console.log('this: ',this);
                console.log('data.toUserId: ',data.toUser);
                $(`#all_users_id_${data.toUser}`).remove();

                $('#friends').prepend(`
                            
                <li friendId="${data.toUser} friendshipId="${data.friendshipId}">
                    <div class="list-content-wrapper">
                        <a href="" class="profile-btn">${data.toUserName}</a>
                        <a class="msg-add-friend initiate-msg"><i class="fas fa-comment-dots"></i></a>
                    </div>
                    <div class="side-list-border"></div>
                </li>

                `);
                $('#notification-bell button').append(`

                <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    <span class="visually-hidden">New alerts</span>
                </span>
                `);
                $('#notification-bell ul').prepend(`
                
                
                    <li type="other-notifs" notif_uid="${data.toUser}"><div class="dropdown-item other-notifs">
                        <div class="req-detail">
                            <p><a href="">${data.toUserName}</a> has accepted your friend request</p>
                        </div>
                        <div class="req-decision notif-close-btn">
                                 <i class="fas fa-times"></i>
                        </div>
                        </div>
                    </li>
                `);
                let friendCount=$('#friends-count div').last().html();
                $('#friends-count div').last().html(+friendCount +1);
                $('#add-friend').attr('class','sendMsg');
                $('#add-friend').html(`
                
                    <button userIdValue="${data.toUser}">
                    Message</button>
                `);


                deleteNotif();
                
                $('#no_notifs').prop('class','hidden');
                initiateChat(self,data.toUser);
                $('#add-friend').html(`
                <button userIdValue="${data.toUser}">
                    Message</button>
                `);
                $('#add-friend').attr('class','sendMsg');

            });
            self.socket.on('request rejected by user',function(data){
                $(`a[useridvalue="${data.toUser}"]`).html('<i class="fas fa-user-plus"></i>');


                $('#add-friend').html(`
                
                <button userIdValue="${data.toUser}">
                Add friend</button>
                
                `);       
                $('#add-friend').attr('class','toggleFriendReq');       
            });
            self.socket.on('new message recieved',function(data){
                
                $(`#friends li[friendid=${data.sentBy}] .msg-add-friend`).append(

                    `
                    
                        <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                            <span class="visually-hidden">New alerts</span>
                        </span>
                    
                    `
                )
                $('#chats').append(

                    `
                    
                    <li class="user-msg">
                        <div class="username"><p>${data.senderName}</p></div>
                        <div class="msg-content"><p>${data.message}</p></div>
                    </li>
                    
                    
                `);
                if(($(`#chat-container`).attr('friendid') && $(`#chat-container`).attr('friendid').toString()==data.sentBy.toString())){
                    $.ajax({
                        type:'post',
                        url:`/message/seen/${data.messageId}`,
                        success:function(){
                            console.log('xyz: ',$(`li[friendid="${data.sentBy}"] .notification-badge`));
                            console.log(`li[friendid="${data.sentBy}"`);
                            console.log('data: ',data);
                            $(`li[friendid="${data.sentBy}"] .notification-badge`).remove();
                        }
                    });
                }



            });
            deleteNotif();
            acceptRejectBtn();
            $('#notification_btn').click(function(e){
                $('#notification_btn .notification-badge').remove();
            })
        });

        

    }
}

