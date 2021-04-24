const express = require('express');
const app = express();
const router = require('./routers');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public/', express.static('./uploads'));
app.use('/life-notes-sharing', router);

// const routers = Object.keys(router);
// routers.forEach(key => {
//   app.use('/life-notes-sharing', router[key]);
// })

app.listen(3000, function () {
  console.log('app is running at port 3000')
})
