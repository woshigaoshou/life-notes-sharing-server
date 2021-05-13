const { Note, User } = require('../modules');
const { url } = require('../public/constant');

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
const multer = require('multer');
var formidable = require('formidable');


// file 图片文件
// sign 标识（用户唯一id、其他唯一值皆可）
function saveImg(file, sign) {
  return new Promise((resolve, reject) => {
      fs.readFile(file.path, async (err, data) => {
          if (err) {
              reject(err)
          }
          // 拓展名
          let extName = file.mimetype.split('/')[1]
          // 拼接成图片名
          // 这里可以自行修改
          let imgName = `${sign}-${Date.now()}.${extName}`
          // 写入图片
          // 写入自己想要存入的地址
          await fs.writeFile(path.join( __dirname, `xxx/${imgName}`), data, err => {
              if (err) { reject(err) }
          })
          // 删除二进制文件
          await fs.unlink(file.path, err => {
              if (err) { reject(err) }
          })
          // 验证是否存入
          await fs.stat(path.join( __dirname, `xxx/${imgName}`), err => {
              if (err) { reject(err) }
              // 成功就返回图片相对地址
              resolve(`xxx\\${imgName}`)
          })
      })
  })
}


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
  // console.log(data);
  
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
  const ids = data.map(item => item.appreciates).reduce((prev, current) => {
    return prev.concat(current.map(value => value.user_id));
  }, []).filter((item, index, arr) => arr.findIndex(val => val === item) === index);

  console.log(ids);
  
  const userList = await User.find({ _id: { $in: ids } });
  console.log(userList);
  
  
  const list = [];
  data.forEach(note => {
    list.push(...note.appreciates.map(item => {
      // console.log(item);
      
      const user = userList.find(value => value._id == item.user_id);
      console.log(item.user_id);
      
      return {
        ...item,
        type: 'appreciates',
        avatar: `${url}/public/${user.avatar}`,
        name: user.name,
        cover: `${url}/note/${note.note_detail.note_image[0]}`,
        note_id: note._id,
      }
    }));
    list.push(...note.collect.map(item => {
      const user = userList.find(value => value._id == item.user_id);
      return {
        ...item,
        type: 'collect',
        avatar: `${url}/public/${user.avatar}`,
        name: user.name,
        cover: `${url}/note/${note.note_detail.note_image[0]}`,
        note_id: note._id,
      }
    }))
  })

  
  res.send({
    status: 200,
    data: list.filter(item => item.user_id !== user_id),
    // data: list,
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
      cb(null, 'noteImages/');
    },
    filename: function (req, file, cb) {
      var changedName = (new Date().getTime())+'-'+file.originalname;
      cb(null, changedName);
    }
  })
});

// 多个文件上传
router.post('/createNote', upload.array('files', 6), (req, res) => {  
  let imgFile = req.files; //获取图片上传的资源
  let images = [];
  imgFile.forEach((elem) => {
    images.push(elem.filename);
  });
  const note = new Note({
    author_id: req.body.user_id,
    note_detail: {
      note_image: images,
      note_content: req.body.note_content,
      title: req.body.title,
    },
  });
  note.save().then(result => {
    res.send({
      status: 200,
      data: {
        message: '新建笔记成功',
        note_id: result._id, 
      },
   });
  })
  
});

// router.post('/createNote', upload.array('note_imgs', 6), (req, res) => {
//   let files = req.files
//   Promise.all(
//   files.map( async file => await saveImg(file))
// ).then(([...list]) => {
//   // list保存了所有文件地址返回的相对地址
//   // 可以进行相应的操作
//   console.log(list);
  
// }).catch(err => {
//   // ┭┮﹏┭┮
// })
// })



module.exports = router;
