const express = require('express');
var app = express();
var router = require('./router')
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/public/', express.static('./public/'))
app.use(router)

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/runoob";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("runoob");
  var myobj = { name: "菜鸟教程", url: "www.runoob" };
  dbo.collection("site").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("文档插入成功");
    db.close();
  });
});

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.listen(3000, function () {
  console.log('app is running at port 3000')
})