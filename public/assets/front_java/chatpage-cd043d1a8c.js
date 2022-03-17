class chatEngine{constructor(e,s,t,n){this.userEmail=s,this.userId=t.toString(),this.username=n,this.socket=io.connect("http://50.19.145.241.nip.io:5000"),this.userEmail&&this.connectionHandler()}connectionHandler(){let e=this;console.log("self.socket",e.socket);this.socket.on("connect",function(){var s;console.log("connection established using sockets!"),console.log("self.userId: ",e.userId),e.socket.emit("join_universal_room",{user_id:e.userId,universal_room:"universal_room"}),s=e,$(document).on("submit","#create-msg",function(e){e.preventDefault(),console.log($(this)[0]),console.log("$(formData).serialize(): ",$(this).serialize()),$.ajax({type:"post",url:"/message/create",data:$(this).serialize(),success:function(e){console.log("repeat"),console.log("data: ",e),$("main").append(`
                            <div class="self-msg msg">

                                <div class="username"><p>You</p></div>
                                <div class="msg-content"><p>${e.data.message}</p></div>
                            </div>
                            
                            `),$(document).ready(function(){$("#input-msg input").val("")}),s.socket.emit("message stored in db",{sentBy:e.data.sentBy,sentTo:e.data.sentTo,message:e.data.message,messageId:e.data.messageId})}})}),e.socket.on("new message recieved",function(e){$("main").append(`
                    <div class="user-msg msg">

                        <div class="username"><p>${e.senderName}</p></div>
                        <div class="msg-content"><p>${e.message}</p></div>
                    </div>      
                `),$("#chat-container").attr("friendid")&&$("#chat-container").attr("friendid").toString()==e.sentBy.toString()&&$.ajax({type:"post",url:"/message/seen/"+e.messageId,success:function(){}})})})}}
