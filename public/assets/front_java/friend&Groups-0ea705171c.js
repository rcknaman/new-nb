class chatEngine{constructor(e,n,o,s){this.userEmail=n,this.userId=o.toString(),this.username=s,this.socket=io.connect("http://localhost:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){let e=this;this.socket.on("connect",function(){console.log("connection established using sockets!"),console.log("self.userId: ",e.userId),e.socket.emit("join_universal_room",{user_id:e.userId,universal_room:"universal_room"}),e.socket.on("new message recieved",function(e){console.log("new message recieved"),console.log($(`#friendOrObjectId-${e.sentBy} .notification-badge`).length),$(`#friendId-${e.sentBy} .notification-badge`).length||$(`#friendId-${e.sentBy} .msg-add-friend`).append(`
                    
                    <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    </span>
                    
                    `)}),e.socket.on("new group message recieved",function(e){$(`#groupId-${e.groupId} .notification-badge`).length||$(`#groupId-${e.groupId} .msg-add-friend`).append(`
                    
                    <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    </span>
                    
                    `)})})}}