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
        let acceptRejectFlag=1;
        let acceptRejectBtn=function(){


            function helper(curr){
                let fromUserId=$(curr).parent().attr('userid');
                console.log('fromUserId: ',fromUserId);
                let decision=$(curr).attr('decision');

                // when clicking on accept button
                if(decision=='accept'){

                    $.ajax({

                        type:'post',
                        url:`/users/friends/toggle/${fromUserId}`,
                        success:function(data){
                            console.log('sucess:' ,data);
                            $(`#user-${fromUserId}`).remove();


                            if(!data.alreadyExists){
                            
                                self.socket.emit('friend_request_accepted',{
                                    fromUserId:fromUserId,
                                    toUserId:self.userId,
                                    friendshipId:data.friendshipId
                                });
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
                            

                            $(`#user-${fromUserId} .acceptReject`).remove();
                            $(`#user-${fromUserId} .msg-add-friend`).remove();
                            $(`#user-${fromUserId} .list-content-wrapper`).append(`
                            
                                <a class="msg-add-friend initiate-msg" href="" userIdValue="${fromUserId}">
                                    <i class="fas fa-user-plus"></i>
                                </a>
                            `)
                        }

                    });


                }
            }
            if(acceptRejectFlag==1){
                $(document).on('click',`.acceptReject button`,function(e){
                    console.log('hello');
                    helper(this);
                });
                acceptRejectFlag=0;
            }


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

            $(document).on('click','.msg-add-friend',function(e){

                e.preventDefault();
                self.socket.emit('sendFriendReq',{
                    fromUserId:self.userId,
                    toUserId:$(this).attr('userIdValue')
                });
            });

            self.socket.on('friend_request_sent',function(data){
                console.log('friend request sent');
                console.log(data.toUser);
                console.log($(`a[userIdValue="${data.toUser}"]`)[0]);
                $($(`a[userIdValue="${data.toUser}"]`)[0]).html('<i class="fas fa-check"></i>');
            });

            self.socket.on('friend_request_recieved',function(data){


                console.log('friend_request_recieved');

                $(`#user-${data.fromUser} a.msg-add-friend`).remove();

                $(`#user-${data.fromUser} .list-content-wrapper`).append(`<div class='acceptReject' userid="${data.fromUser}">
                
                    <button decision="accept"><i class="far fa-check-circle fa-sm"></i></button>
                    <button decision="reject"><i class="far fa-times-circle fa-sm"></i></button>
                
                
                </div>`);
                acceptRejectBtn(acceptRejectFlag);
            });

            self.socket.on('friend_request_cancelled_sender',function(data){

            // acceptRejectBtn();

                $($(`a[userIdValue="${data.toUser}"]`)[0]).html('<i class="fas fa-user-plus"></i>');
            });

            self.socket.on('friend_request_cancelled_reciever',function(data){

                $(`#user-${data.fromUser} .acceptReject`).remove();
                $(`#user-${data.fromUser} .list-content-wrapper`).append(`
                
                <a class="msg-add-friend initiate-msg" href="" userIdValue="${data.fromUser}">
                    <i class="fas fa-user-plus"></i>
                </a>
                `)



            });

            self.socket.on('request accepted by friend',function(data){

                $(`#user-${data.toUser}`).remove();

            })

            acceptRejectBtn();
        });
    }
}