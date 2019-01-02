(function () {
    var d = document,
        w = window,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode == 'CSS1Compat',
        dx = dc ? dd : db,
        ec = encodeURIComponent;

    w.CHAT = {
        msgObj: d.getElementById("message"),
        screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
        username: null,
        userid: null,
        socket: null,

        // 让浏览器滚动到最底部
        scrollToBottom() {
            w.scrollTo(0, this.msgObj.clientHeight);
        },

        // 退出
        logout() {
            location.reload();
        },
        // 提交聊天消息内容
        submit: function () {
            var content = d.getElementById('content').value;
            if (content != '') {
                var obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                this.socket.emit('message', obj);
            }

            return false;
        },
        // 好像就是获取一个随机数
        genUid() {
            // 返回一个时间戳+随机数
            return new Date().getTime() + "" + Math.floor(Math.random() * 889 + 100);
        },
        updateSysMsg(o, action) {
            var onlineUsers = o.onlineUsers;
            var onlineCount = o.onlineCount;
            var user = o.user;

            //更新在线人数

            var userhtml = "";
            var separator = "";

            for (var key in onlineUsers) {
                if (onlineUsers.hasOwnProperty(key)) {
                    userhtml += separator + onlineUsers[key];
                    separator = '`';
                }
            }

            d.getElementById('onlinecount').innerHTML = `当前共有${onlineCount}人在线，在线列表${userhtml}`;

            // 添加系统消息
            var html = "";
            html += '<div class="msg-system">';
            html += user.username;
            html += (action == 'login') ? '加入聊天室' : '退出聊天室';
            html += '</div>';

            var section = d.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            this.msgObj.appendChild(section);
            this.scrollToBottom;
        },
        // 第一个界面用户提交用户名
        usernameSubmit() {
            var username = d.getElementById('username').value;
            if (username != "") {
                d.getElementById('username').value = "";
                d.getElementById('loginbox').style.display = 'none';
                d.getElementById('chatbox').style.display = 'block';
                this.init(username);
            }
            return false;
        },
        // 初始化
        init(username){
            // 客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
            // 实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
            console.log('111');
            this.userid = this.genUid();
            this.username = username;

            d.getElementById('showusername').innerHTML = this.username;

            this.msgObj.style.minHeight = (this.screenheight - db.clientHeight + this.msgObj.clientHeight) + 'px';
            this.scrollToBottom();
            
            // 连接websocket服务器
            // this.socket = io.connect('ws://139.199.163.196:3000/');
            this.socket = io.connect('ws://192.168.1.103:3000/');
            console.log('222')
            // 告诉服务器有用户登陆
            this.socket.emit('login', {userid:this.userid, username: this.username});

            // 监听新用户登陆
            this.socket.on('login', function(o){
                console.log('login',o)
                CHAT.updateSysMsg(o,'login');
            });

            // 监听用户退出
            this.socket.on('logout', function(o){
                CHAT.updateSysMsg(o, 'logout');
            });

            // 监听消息发送
            this.socket.on('message', function(obj){
                var isme = (obj.userid == CHAT.userid ? true: false);
                var contentDiv = `<div>${obj.content}</div>`;
                var usernameSpan = `<span style="color:red">${obj.username}</span>`;
                var section = d.createElement('section');
                if(isme){
                    section.className = "user";
                    section.innerHTML = usernameSpan + contentDiv;
                }else{
                    section.className = "service";
                    section.innerHTML = usernameSpan + contentDiv;
                }

                CHAT.msgObj.appendChild(section);
                CHAT.scrollToBottom();
            })
        }
    }
})();