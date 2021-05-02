const { Note, User } = require('../modules');
const { url } = require('../public/constant');

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
const multer = require('multer');
var formidable = require('formidable');

router.get('/list',async (req, res) => {
  const params = {};
  if (req.query.keyword) {
    params.$or = [
      {'note_detail.title': { $regex: new RegExp(req.query.keyword, 'i') } },
      {'note_detail.note_content': { $regex: new RegExp(req.query.keyword, 'i') } },
    ];
  }

  const data = await Note.find(params).populate('author_id', 'avatar name')
  data.forEach(item => {   
    const images = item.note_detail.note_image;
    
    item.note_detail.note_image = images.map(img => `${url}/note/${img}`);
  });

  res.send({
    status: 200,
    data,
  })
})

router.get('/detail/:id',async (req, res) => {
  const { id } = req.params;
  const data = await Note.findOne({ _id: id }).populate('author_id', 'avatar name');
  console.log(data);
  
  data.author_id.avatar = `${url}/public/${data.author_id.avatar}`;
  data.note_detail.note_image = data.note_detail.note_image.map(img => `${url}/note/${img}`);
  res.send({
    status: 200,
    data,
  });
});

router.get('/classifylist/:type/:user_id',async (req, res) => {
  const { type, user_id } = req.params;
  
  let data = [];
  if (type == 1) {
    data = await Note.find({ author_id: user_id });
  } else if (type == 2) {
    data = await Note.find({ 'collect.user_id': user_id }).populate('author_id', 'avatar name');
  } else {
    data = await Note.find({ 'appreciates.user_id': user_id }).populate('author_id', 'avatar name');
  }
  data.forEach(item => {   
    const images = item.note_detail.note_image;
    item.note_detail.note_image = images.map(img => `${url}/note/${img}`);
  });

  res.send({
    status: 200,
    data,
  })
})

router.put('/thumbup', async (req, res) => {
  const type = req.body.type;
  const note_id = req.body.note_id;
  const user_id = req.body.user_id;
  const date = req.body.date;
  
  if (type === 'add') {
    await Note.findByIdAndUpdate(note_id, { $push: { appreciates: { user_id, date } } });
  } else {
    await Note.findByIdAndUpdate(note_id, { $pull: { appreciates: { user_id } } });
  }
  res.send({
    status: 200,
    data: {
      message: '操作成功',
    }
  })
});

router.put('/collect', async (req, res) => {
  const type = req.body.type;
  const note_id = req.body.note_id;
  const user_id = req.body.user_id;
  const date = req.body.date;

  if (type === 'add') {
    await Note.findByIdAndUpdate(note_id, { $push: { collect: { user_id, date } } });
  } else {
    await Note.findByIdAndUpdate(note_id, { $pull: { collect: { user_id } } });

  }
  res.send({
    status: 200,
    data: {
      message: '操作成功',
    }
  })
});

router.get('/appreciatesList/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const data = await Note.find({ author_id: user_id }).populate('author_id', 'avatar name');
  
  const list = [];
  data.forEach(note => {
    list.push(...note.appreciates.map(item => ({
      ...item,
      type: 'appreciates',
      avatar: `${url}/public/${note.author_id.avatar}`,
      name: note.author_id.name,
      cover: `${url}/note/${note.note_detail.note_image[0]}`,
      note_id: note._id,
    })));
    list.push(...note.collect.map(item => ({
      ...item,
      type: 'collect',
      avatar: `${url}/public/${note.author_id.avatar}`,
      name: note.author_id.name,
      cover: `${url}/note/${note.note_detail.note_image[0]}`,
      note_id: note._id,
    })))
  })

  res.send({
    status: 200,
    data: list,
  })
})

router.delete('/delNote/:id', (req, res) => {
  Note.remove({ _id: req.params.id }, err => {
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

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../note/');
    },
    filename: function (req, file, cb) {
      var changedName = (new Date().getTime())+'-'+file.originalname;
      cb(null, changedName);
    }
  })
});

//多个文件上传
router.post('/createNote', upload.array('multerFile'), (req, res) => {
  console.log(req);
  
  console.log(req.files);
  let imgFile = req.file; //获取图片上传的资源
  let images = [];

  imgFile.forEach((elem) => {
    console.log(elem);
    
    images.push({
      originalname: elem.originalname
    })
  });
  res.json({
      code: '0000',
      type: 'multer',
      fileList: fileList
  });
});


module.exports = router;
