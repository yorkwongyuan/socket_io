var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req,res){
    res.send('<h1>Welcome Realtime Server</h1>');
});

var onlineUsers = {};

var onlineCount = 0;

// 有用户加入
io.on('connection', function(socket){
    console.log('a user connected');

    // 监听用户加入
    socket.on('login', function(obj){
        socket.name = obj.userid;

        // 检查在线人数，如不存在，则加入
        if(!onlineUsers.hasOwnProperty(obj.userid)){
            onlineUsers[obj.userid] = obj.username;
            // 在线人数增加
            onlineCount++;
        };
        console.log(onlineCount,'onlineCount????')
        // 向所有客户端广播用户加入
        io.emit('login',{onlineUsers: onlineUsers, onlineCount: onlineCount, user:obj});
    });

    // 监听用户退出
    socket.on('disconnect', function(obj){
        // 用户退出则从用户在线表中将其删除
        if(onlineUsers.hasOwnProperty(socket.name)){
            delete onlineUsers[socket.name];
            // 在线人数减一
            onlineCount --;

            // 向所有用户通知有人退出
            io.emit('logout', {onlineUsers:onlineUsers, onlineCount: onlineCount, user:obj});
            console.log(obj.username + '退出聊天室');
        }
    });

    // 监听用户发送聊天内容
    socket.on('message', function(obj){
        // 向所有用户发送广播
        io.emit('message', obj);
        console.log(obj.username + '说' + obj.content);
    });
});

http.listen(3000, function(){
    console.log('listening on *: 3000');
})
