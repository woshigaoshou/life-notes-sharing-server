const { User } = require('../modules');

var express = require('express');
var router = express.Router();

router.post('/save', function (req, res) {  
  const user = new User({
    ...req.body,
    sign: true,
  });
  user.save();
  res.send('注册成功');
})

router.put('/update', function (req, res) {
  const query = { account: 'account1' };
  const doc = { password: 123456 };
  User.update(query, doc, function (req, res) {
    console.log(res);
  })
  res.send('update');
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
