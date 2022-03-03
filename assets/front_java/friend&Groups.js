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

        this.socket.on('connect',function(){

            console.log(
                'connection established using sockets!'
            );
            console.log('self.userId: ',self.userId);
            self.socket.emit('join_universal_room',{

                user_id:self.userId,
                universal_room:'universal_room'
            });

            

            self.socket.on('new message recieved',function(data){
                
                console.log('new message recieved');
                console.log($(`#friendOrObjectId-${data.sentBy} .notification-badge`).length);
                if(!$(`#friendId-${data.sentBy} .notification-badge`).length){
                    $(`#friendId-${data.sentBy} .msg-add-friend`).append(`
                    
                    <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    </span>
                    
                    `)
                }
            });
            self.socket.on('new group message recieved',function(data){

                if(!$(`#groupId-${data.groupId} .notification-badge`).length){
                    $(`#groupId-${data.groupId} .msg-add-friend`).append(`
                    
                    <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    </span>
                    
                    `)
                }

            });

        });
    }
}