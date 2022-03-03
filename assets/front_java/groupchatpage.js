class chatEngine{

    constructor(ChatBoxId,useremail,userid,username){

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
        console.log('self.socket',self.socket);
        let sendingMsg=function(self){

            $(document).on('submit','#create-msg',function(e){
                
                e.preventDefault()
                console.log($(this)[0]);
                console.log('$(formData).serialize(): ',$(this).serialize());

                $.ajax({

                    type:'post',
                    url:'/groups/Createmessage',
                    data:$(this).serialize(),
                    success:function(data){
                        console.log('repeat');
                        console.log('data: ',data);
                        
                        $('main').append(

                            `
                            <div class="self-msg msg">

                                <div class="username"><p>You</p></div>
                                <div class="msg-content"><p>${data.data.message}</p></div>
                            </div>
                            
                            `);
                        $(document).ready(function(){
                            $('#input-msg input').val('');
                        });
                        
                        self.socket.emit('group message stored in db',{
                            sentBy:data.data.sentBy,
                            groupId:data.data.groupId,
                            message:data.data.message,
                            messageId:data.data.messageId,
                            members:data.data.members
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

            
            sendingMsg(self);

            self.socket.on('new group message recieved',function(data){
                
                if(data.sentBy.toString()!=self.userId.toString()){



                    $('main').append(

                        `
                        <div class="user-msg msg">

                            <div class="username"><p>${data.senderName}</p></div>
                            <div class="msg-content"><p>${data.message}</p></div>
                        </div>      
                    `);
                    
                    $.ajax({
                        type:'post',
                        url:`/groups/seenMessage/${data.messageId}`,
                        success:function(){
                            
                        }
                    });
                    
            
                }
            
            });


        });
    }
}