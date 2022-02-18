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
const Friend=require('../models/friends');
let socketId=require('../variableContainer/variableContainer').socketIdContainer;
module.exports.chatSockets=async function(socketServer){

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
        
        socket.on('join_universal_room',function(data){
            console.log(data.user_id);
            socketId[data.user_id]=socket.id;
            console.log('user joined in universal room!',data);
            console.log(socketId);

        });

        socket.on('sendFriendReq',async function(data){
            console.log('data.toUserId: ',data.toUserId);
            console.log('socketId[data.toUserId:] ',socketId[data.toUserId]);
            
                let requestedby=await User.findById(data.fromUserId);
                if(requestedby.sendedRequest.includes(data.toUserId)){
                    if(socketId[data.toUserId]){
                        io.sockets.in(socketId[data.toUserId]).emit('friend_request_cancelled_reciever', {fromUser: data.fromUserId,username:requestedby.name});                     
                    }
                    await User.updateOne({_id:data.toUserId},{$pull:{friendRequests:data.fromUserId}});
                    await User.updateOne({_id:data.fromUserId},{$pull:{sendedRequest:data.toUserId}});
                    io.sockets.in(socketId[data.fromUserId]).emit('friend_request_cancelled_sender',{toUser: data.toUserId});

                }else{


                    if(socketId[data.toUserId]){
                        io.sockets.in(socketId[data.toUserId]).emit('friend_request_recieved', {fromUser: data.fromUserId,username:requestedby.name});                     
                    }
                    io.sockets.in(socketId[data.fromUserId]).emit('friend_request_sent',{toUser: data.toUserId});
                    await User.updateOne({_id:data.toUserId},{$push:{friendRequests:data.fromUserId}});
                    await User.updateOne({_id:data.fromUserId},{$push:{sendedRequest:data.toUserId}});
                }
                console.log('new_friend_req');
        });
        socket.on('friend_request_accepted',async function(data){

            let user1=await User.findById(data.toUserId);
            await User.updateOne({_id:data.fromUserId},{$push:{reqAcceptedNotif:data.toUserId}});
            io.sockets.in(socketId[data.fromUserId]).emit('request accepted by friend',{toUser:data.toUserId,toUserName:user1.name});
        });
        socket.on('friend_request_rejected',async function(data){

            io.sockets.in(socketId[data.fromUserId]).emit('request rejected by user',{toUser:data.toUserId});

        });
    });








    // let clients = io.sockets.adapter.rooms.get('Room Name');
    // console.log('clients: ',clients);
}