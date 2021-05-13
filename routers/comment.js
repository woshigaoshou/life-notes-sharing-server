const { Comment } = require('../modules');
const { url } = require('../public/constant');

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var formidable = require('formidable');
// 引入jwt token工具
const JwtUtil = require('../public/utils/jwt');

const multer = require('multer');


router.post('/save', function (req, res) {  
  const comment = new Comment({
    ...req.body,
  });
  comment.save();
    res.send({
      status: 200,
      message: '发送评论成功',
    });
})

router.delete('/delete/:id', function (req, res) {  
  Comment.remove({ _id: req.params.id }, err => {
    if (err) {
      res.send({
        status: 0,
        message: '删除失败',
      });
    } else {
      res.send({
        status: 200,
        message: '删除成功',
      });
    }
  })
})

router.get('/fetch/:id', (req, res) => {
  const id = req.params.id;  
  Comment.find({ note_id: id }).populate('user_id', 'avatar name').then(result => {
    const list = JSON.parse(JSON.stringify(result));
    list.forEach(item => {
      item.avatar = `${url}/public/${item.user_id.avatar}`;
      item.user_name = item.user_id.name;
      item.user_id =  item.user_id._id;
    });
    res.send({
      status: 200,
      message: '获取评论成功',
      data: {
        list,
      },
    });
})
})

router.get('/history/:id', (req, res) => {

  const id = req.params.id;  
  
  Comment.find({ user_id: id }).populate('user_id', 'avatar name').populate('note_id', 'note_detail').then(result => {
    const list = JSON.parse(JSON.stringify(result));
    list.forEach(item => {
      item.avatar = `${url}/public/${item.user_id.avatar}`;
      item.user_name = item.user_id.name;
      item.user_id =  item.user_id._id;

      item.cover = `${url}/note/${item.note_id.note_detail.note_image[0]}`;
      item.note_id = item.note_id._id;
    });
    list.filter(item => item.user_id !== user_id)
    res.send({
      status: 200,
      message: '获取评论成功',
      data: {
        list,
      },
    });
})
})

router.put('/thumbUp', async (req, res) => {
  const type = req.body.type;
  const user_id = req.body.user_id;
  const comment_id = req.body.comment_id;

  if (type === 'add') {
    await Comment.findByIdAndUpdate(comment_id, { $push: { comment_appreciates: user_id } });
  } else {
    await Comment.findByIdAndUpdate(comment_id, { $pull: { comment_appreciates: user_id } });
  }
  res.send({
    status: 200,
    message: type === 'add' ? '点赞评论成功' : '取消点赞评论成功',
  });
})


  // console.log(data);
  
  // res.send({
  //   status: 200,
  //   message: '发送评论成功',
  //   data: {
  //     list: data,
  //   },
  // });


module.exports = router;
