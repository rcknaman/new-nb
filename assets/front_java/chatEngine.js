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
        let func=function(){


            $(`.req-decision button`).click(function(){
                let fromUserId=$(' .req-detail',$(this).parent().parent()).attr('userid')
                console.log('fromUserId: ',fromUserId);
                let decision=$(this).attr('decision');

                // when clicking on accept button
                if(decision=='accept'){

                    $.ajax({

                        type:'post',
                        url:`/users/friends/toggle/${fromUserId}`,
                        success:function(data){
                            console.log('sucess:' ,data);
                            $(`div[userid="${fromUserId}"]`).parent().parent().remove();
                            $(`#all_users_id_${fromUserId}`).remove();

                            

                            if(!data.alreadyExists){
                                $('#friends').prepend(`
                            
                                <li>
                                    <div class="list-content-wrapper">
                                        <a href="" class="profile-btn">${data.friendName}</a>
                                        <a href="" class="msg-add-friend"><i class="fas fa-comment-dots"></i></a>
                                    </div>
                                    <div class="side-list-border"></div>
                                </li>
        
                                `);
                                self.socket.emit('friend_request_accepted',{
                                    fromUserId:fromUserId,
                                    toUserId:self.userId
                                });
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

                            $(`div[userid="${fromUserId}"]`).parent().parent().remove();
                            if($('#notification-bell li').length==1){
                                $('#no_notifs').prop('class','');
                            }
                        }

                    })


                }
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

            $('.msg-add-friend').click(function(e){

                e.preventDefault();
                self.socket.emit('sendFriendReq',{
                    fromUserId:self.userId,
                    toUserId:$(this).attr('userIdValue')
                })


            });

            // when the request is recieved by end user
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
                $(`a[useridvalue='${data.fromUser}']`).css('pointer-events','none');
                $('#no_notifs').prop('class','hidden');
                func();
            });

            // while sending friend request
            self.socket.on('friend_request_sent',function(data){
                console.log('friend request sent');
                console.log(data.toUser);
                console.log($(`a[userIdValue="${data.toUser}"]`)[0]);
                $($(`a[userIdValue="${data.toUser}"]`)[0]).html('<i class="fas fa-check"></i>');
            });


            // toggling between sending the friend request and taking it back---
            self.socket.on('friend_request_cancelled_reciever',function(data){


                $(`div[userid="${data.fromUser}"]`).parent().parent().remove();
                $('#notification_btn .notification-badge').remove();
                if($('#notification-bell li').length==1){
                    $('#no_notifs').prop('class','');
                }
                $(`a[useridvalue='${data.fromUser}']`).css('pointer-events','');
            })
            self.socket.on('friend_request_cancelled_sender',function(data){

                $(`a[userIdValue="${data.toUser}"]`).html('<i class="fas fa-user-plus"></i>')
            });
// --------------------------------------------


            // when clicking on accept or reject button
           
            self.socket.on('request accepted by friend',function(data){

                console.log('data.toUserId: ',data.toUser);
                $(`#all_users_id_${data.toUser}`).remove();

                $('#friends').prepend(`
                            
                <li>
                    <div class="list-content-wrapper">
                        <a href="" class="profile-btn">${data.toUserName}</a>
                        <a href="" class="msg-add-friend"><i class="fas fa-comment-dots"></i></a>
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
                console.log('.notif-close-btn:',$('.notif-close-btn'));
                console.log('other notifs: ',$(`li[type="other-notifs"]`));
                deleteNotif();
                
                $('#no_notifs').prop('class','hidden');


            });
            self.socket.on('request rejected by user',function(data){
                $(`a[useridvalue="${data.toUser}"]`).html('<i class="fas fa-user-plus"></i>')
            });
            deleteNotif();
            func();
            $('#notification_btn').click(function(e){
                $('#notification_btn .notification-badge').remove();
            })
        });

        

    }
}

