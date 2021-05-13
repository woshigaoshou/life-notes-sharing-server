const { Chat } = require('../modules');
const { url } = require('../public/constant');

var express = require('express');
var router = express.Router();

router.get('/fetch/:id', async (req, res) => {
  const id = req.params.id;
  const params = {};
  params.$or = [
    {'user1_id': id },
    {'user2_id': id },
  ];
  let isUser1 = false;
  const data = await Chat.find(params).populate('user1_id', 'avatar name').populate('user2_id', 'avatar name');
  const list = data.map(item => {
    let user = {};
    if (item.user1_id._id == id) {
      isUser1 = true;
      user = {
        avatar: `${url}/public/${item.user2_id.avatar}`,
        name: item.user2_id.name,
        _id: item.user2_id._id,
      };
    } else {
      user = {
        avatar: `${url}/public/${item.user1_id.avatar}`,
        name: item.user1_id.name,
        _id: item.user1_id._id,
      };
    }
    return {
      chat_record: item.chat_record,
      receiver: user,
      isUser1: item.user1_id._id == id,
    };
  })
  console.log(data);
  res.send({
    status: 200,
    data: list,
  });
});

router.post('/create', async (req, res) => {
  const chat = new Chat({
    user1_id: req.body.user1_id,
    user2_id: req.body.user2_id,
    chat_record: [{
      date: req.body.date,
      content: [{
        data: 'Hello!',
        isUser1: true,
      }]
    }]
  })
  await chat.save();
  const data = await Chat.find({
    user1_id: req.body.user1_id,
    user2_id: req.body.user2_id,
  }).populate('user1_id', 'avatar name').populate('user2_id', 'avatar name');
  const user = {
    avatar: `${url}/public/${data[0].user2_id.avatar}`,
    name: data[0].user2_id.name,
    _id: data[0].user2_id._id,
  };
  
  res.send({
    status: 200,
    msg: '创建成功',
    data: {
      chat_record: data[0].chat_record,
      receiver: user,
      isUser1: true,
    },
  });
});

router.delete('/detele', async (req, res) => {
  const { user1_id, user2_id } = req.body;
  Chat.remove({ user1_id, user2_id }, err => {
    if (err) {
      res.send({
        status: 0,
        msg: '删除失败',
      })    
    } else {
      res.send({
        status: 200,
        msg: '删除成功',
      })
    }
  })
});

module.exports = router;
