class chatEngine{constructor(s,e,t,o){this.userEmail=e,this.userId=t.toString(),this.username=o,this.socket=io.connect("http://localhost:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){let t=this;console.log("self.socket",t.socket);this.socket.on("connect",function(){var e;console.log("connection established using sockets!"),console.log("self.userId: ",t.userId),t.socket.emit("join_universal_room",{user_id:t.userId,universal_room:"universal_room"}),e=t,$(document).on("submit","#create-msg",function(s){s.preventDefault(),console.log($(this)[0]),console.log("$(formData).serialize(): ",$(this).serialize()),$.ajax({type:"post",url:"/groups/Createmessage",data:$(this).serialize(),success:function(s){console.log("repeat"),console.log("data: ",s),$("main").append(`
                            <div class="self-msg msg">

                                <div class="username"><p>You</p></div>
                                <div class="msg-content"><p>${s.data.message}</p></div>
                            </div>
                            
                            `),$(document).ready(function(){$("#input-msg input").val("")}),e.socket.emit("group message stored in db",{sentBy:s.data.sentBy,groupId:s.data.groupId,message:s.data.message,messageId:s.data.messageId,members:s.data.members})}})}),t.socket.on("new group message recieved",function(s){s.sentBy.toString()!=t.userId.toString()&&($("main").append(`
                        <div class="user-msg msg">

                            <div class="username"><p>${s.senderName}</p></div>
                            <div class="msg-content"><p>${s.message}</p></div>
                        </div>      
                    `),$.ajax({type:"post",url:"/groups/seenMessage/"+s.messageId,success:function(){}}))})})}}