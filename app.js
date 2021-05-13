const express = require('express');
const app = express();
const router = require('./routers');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// 引入jwt token工具
const JwtUtil = require('./public/utils/jwt');
const { Chat } = require('./modules');

const cors = require('cors');

app.use(cors({
  origin: "*",
  credentials: true,
  methods: "PUT,POST,GET,DELETE,OPTIONS",
  
}));

mongoose.connect('mongodb://localhost/lifeNotesSharing', function (err) {
  if (err) {
    console.log('连接失败');
  } else {
    console.log('连接成功');
  }
});

//设置跨域访问
// app.all('*', function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By", ' 3.2.1');
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });

// 导入ws模块
const WebSocket=require('ws');
let wss = new WebSocket.Server({
    port: 8001,
});
// 用户连接时触发
wss.on('connection',function(ws,request){
    // 接收数据时触发
    ws.on('message',async message => {
        // 默认接收的message是一个字符串 需用用JSON.parse()转成对象
        let info=JSON.parse(message);
        // console.log(info);
        
        // 如果是登录请求 为客户端对象ws添加一个user属性info中的user属性
        if(info.type==='login'){
          ws['user'] = info.user;
        //   const params = {};
        //   params.$or = [
        //     {'user1_id': info.user },
        //     {'user2_id': info.user },
        //   ];
        //   const data = Chat.find(params).populate('user1_id', 'avatar name').populate('user2_id', 'avatar name');

        //   // wss.clients.forEach(element => {

        //   // })
        //   wss.clients.forEach(element => {
        //     // 如果遍历到的客户端的user和info中的to相同 则发送信息给该客户端
        //     if(element['user'] === info.to){
        //         element.send(info.message)
        //     }
        // });

        } else if(info.type === 'message'){
        // 如果是信息请求 则遍历wss.clients这个客户端set对象 
        // 注意 这个对象是set类型 所以需要使用forEach进行遍历
            const params = {};
            console.log(info);
            
            params.$or = [
              {'user1_id': info.to, 'user2_id': info.from },
              {'user2_id': info.to, 'user1_id': info.from },
            ];
            const data = await Chat.findOne(params);
            console.log(data);
            const { length } = data.chat_record;
            
            
            // 当前日期的数据未创建
            if (data.chat_record[length - 1].date !== info.date) {
              console.log('当前日期未创建');
              
              await Chat.findOneAndUpdate(params, { $push: { chat_record: {
                date: info.date,
                content: [{
                  data: info.message,
                  isUser1: info.from == data.user1_id,
                }],
              } }
            });
            } else {
              // const currentDateIndex = data.chat_record[length - 1].content;
              console.log('当前日期已创建');
              
              // Chat.findOneAndUpdate(params, { $push: { chat_record: {
              //   $position: length - 1,
              // } } });
              await Chat.findOneAndUpdate(params, { $push: { [`chat_record.${length - 1}.content`]: {
                data: info.message,
                isUser1: info.from == data.user1_id,
              } } });
            }
            
            
            wss.clients.forEach(element => {
                // 如果遍历到的客户端的user和info中的to相同 则发送信息给该客户端
                if(element['user'] === info.to){
                    element.send(JSON.stringify({
                      msg: info.message,
                      isUser1: info.from == data.user1_id,
                      from: info.from,
                    }));
                }
            });
        } else {
          wss.clients.forEach(element => {
            // 如果遍历到的客户端的user和info中的to相同 则发送信息给该客户端
            if(element['user'] === info.to){
                element.send(JSON.stringify({
                  type: 'refresh',
                }));
            }
          });
        }
    })
})

app.use(function (req, res, next) {
  // 不需要token的请求
  const urls = 
          [
            '/user/login',
            'user/register',
            'note/list',
            'note/detail',
            'user/detail',
            'hotSearch',
            // '/appreciatesList',
            '.jpg',
            '.png',
          ];
  // console.log(req.url);
  if (!urls.some(url => req.url.includes(url))) {
      let token = req.headers.token;
      let jwt = new JwtUtil(token);
      let result = jwt.verifyToken();
      // 如果考验通过就next，否则就返回登陆信息不正确
      if (result == 'err') {
          // console.log(result);
          res.send({status: 403, message: '登录已过期,请重新登录'});
          // res.render('login.html');
      } else {
          next();
      }
  } else {
      next();
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public/', express.static('./uploads'));
app.use('/note/', express.static('./noteImages'));
app.use('/life-notes-sharing', router);

// const routers = Object.keys(router);
// routers.forEach(key => {
//   app.use('/life-notes-sharing', router[key]);
// })

app.listen(3000, function () {
  console.log('app is running at port 3000')
})
