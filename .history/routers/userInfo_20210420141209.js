const { User } = require('../modules');

var express = require('express');
var router = express.Router();

router.post('/register', function (req, res) {  
  const user = new User({
    ...req.body,
    sign: true,
  });
  user.save();
  res.send('注册成功');
})

router.post('/login', function (req, res) {  
  User.findOne({ ...req.body }).then(result => {
    if (result !== null) {
      res.send({
        status: 200,
        message: '登录失败',
      });
    } else {
      res.send({
        status: 0,
        message: '登录成功',
      });
    }
  });  
})

router.put('/retrieve', function (req, res) {
  const query = {
    phoneNum: req.body.phoneNum,
    password: req.body.password,
  };
  const doc = { password: req.body.newPassword };
  User.findOneAndUpdate(query, doc, function (req, result) {
    if (result !== null) {
      res.send({
        status: 200,
        message: '找回密码成功'
      });
    } else {
      res.send({
        status: 0,
        message: '找回密码失败'
      });
    }
  })

})

router.delete('/delete', function (req, res) {
  const query = { account: 'account1' };
  const doc = { password: 123456 };
  User.remove(query, doc, function (req, res) {
    console.log(res);
  })
  res.send('delete');
})

router.get('/find', function (req, res) {
  const query = { name: '张三' };
  User.find(query, function (req, res) {
    console.log(res);
  })
  res.send('find');
})

module.exports = router;
