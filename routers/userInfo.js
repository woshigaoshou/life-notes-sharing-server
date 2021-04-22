const { User } = require('../modules');

var express = require('express');
var router = express.Router();

router.post('/register', function (req, res) {  
  const user = new User({
    ...req.body,
    profilePhoto: '',
    description: '暂无',
    fans: 0,
    focus: 0,
    appreciates: 0,
    sign: true,
  });
  user.save();
  res.send('注册成功');
})

router.post('/login', function (req, res) {  
  // User.findOne({ ...req.body }).select('name -_id').then(result => {
  User.findOne({ ...req.body }).then(result => {
    
    if (result !== null) {
      res.send({
        status: 200,
        message: '登录成功',
        data: JSON.parse(JSON.stringify(result)),
      });
    } else {
      res.send({
        status: 0,
        message: '登录成功',
        data: {},
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
  User.remove(query, doc, function (err, res) {
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
