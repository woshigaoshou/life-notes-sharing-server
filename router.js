var express = require('express')
var router = express.Router()

const User = require('./modules/userInfo');

router.get('/', function (req, res) {
  // const user = User();
  User.create({
    name: '张三',
    account: 'account1',
    password: '123',
  }).then(res => {
    console.log(res);
  })
  res.send('hello!');
})
module.exports = router
