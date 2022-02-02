// socket for backend site
// this is also known as observer file

// ----------theory---------------

// if we won't be using socket.io then we have two other options 
// 1>pooling=>in which at each small interval say(1-3s) client side will sent a query regarding "is there a new message for
//  this user"
// but this method will put a lot of load on the server as many queries will be there for the server in a small span
// of time
// 2>delayed pooling=>sending the same query to server but the server holds the query and when the new message came,the
// server responds that message to the query which was there on hold and immediately a new query is send to the server
// that "is there a new message for this user"
// 3>in web socket case the sockets(front and backend) interact with each other which is pretty efficient!


// THERE are 2 terms 'on'=>recieving and 'emit'=>sending

// first of all user subscribe the observer and become subscriber and emits req to connect to server socket and when
// server establishes the connection it also emits a res that 'connection successful'

// both front end and backend sockets will interact with each other


const Message=require('../models/message');
const Chatroom=require('../models/chatRoom');
const User=require('../models/user');
module.exports.chatSockets=function(socketServer){

    let io=require('socket.io')(socketServer,{
        cors:{
            origin:'http://localhost:8000',
            methods:['GET','POST']
        }
    });
    // the connecting event name on front end side is 'connect' and in backend side is 'connection' 

    // when the connection is established
    io.on('connection',function(socket){
        console.log('new connection recieved! ',socket.id);
        socket.on('disconnect',function(){
            console.log('socket disconnected');
        });
        // if from front end side a request comes in to join a chat room with some name(say: codial) then these lines 
        // of code will habdle the situation
        socket.on('join_room',function(data){
            // while requesting from frontend we have sended some data which is present in the function's argument
            console.log('joining request recieved',data);
            socket.join(data.chatroom);
            // emitting an event namely 'user_joined' to tell everybody in the room that a new user has joined
            io.in(data.chatroom).emit('user_joined',data);
        });

        socket.on('send_message',function(data){
            console.log('message request recieved',data);
            
            
            Message.create({
                message:data.message,
                sentBy:data.userId,
                chatroom:null
            },function(err,message){
                if(err){
                    console.log('message error: ',err);
                }
                Chatroom.findOneAndUpdate({name:data.chatroomName},{$push:{messageId:message._id}},function(err,chatroom){
                    if(err){
                        console.log('chatroom error: ',err);
                    }
                    console.log('chatroom: ',chatroom);
                    if(!chatroom){
                        // callback hell..we could do it better by using async await
                        Chatroom.create({name:data.chatroomName},function(err,chatRoom){
                            console.log(chatRoom);
                            Chatroom.findByIdAndUpdate(chatRoom._id,{$push:{messageId:message._id}},function(err,chatRoom){
                                User.findByIdAndUpdate(data.userId,{$push:{chatroom:chatRoom._id}},function(err,user){
                                    Message.findByIdAndUpdate(message._id,{chatroom:chatRoom._id},function(err,message){
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                });
                                
                            });
                        });
                    }else{
                        console.log('data.userId: ',data.userId);
                        User.findById(data.userId,function(err,user){
                            console.log('user from else side: ',user);
                            console.log('user.chatroom: ',user.chatroom);
                            if(!user.chatroom.includes(chatroom._id)){
                                // it won't work without callback function
                                User.findByIdAndUpdate(user._id,{$push:{chatroom:chatroom._id}},function(err,user){});  
                            }
                             // it won't work without callback function
                            Message.findByIdAndUpdate(message._id,{chatroom:chatroom},function(err,msg){});
                        });
                        
                    }
                    
                });
                io.in(data.chatroomName).emit('new_message',data);
            });
        });
        
    });
}