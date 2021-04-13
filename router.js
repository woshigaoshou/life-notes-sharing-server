var express = require('express')
var router = express.Router()

const User = require('./modules/userInfo');

router.get('/save', function (req, res) {
  const user = new User({
    name: '张三',
    account: 'account1',
    password: '123',
  });
  user.save();
  // User.create({
  //   name: '张三',
  //   account: 'account1',
  //   password: '123',
  // }).then(res => {
  //   console.log(res);
  // })
  res.send('save');
})
router.get('/update', function (req, res) {
  const query = { account: 'account1' };
  const doc = { password: 123456 };
  User.update(query, doc, function (req, res) {
    console.log(res);
  })
  res.send('update');
})
router.get('/delete', function (req, res) {
  const query = { account: 'account1' };
  const doc = { password: 123456 };
  User.update(query, doc, function (req, res) {
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
module.exports = router
