const { User } = require('../modules');
const { url } = require('../public/constant');

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var formidable = require('formidable');

router.post('/register', function (req, res) {  
  const user = new User({
    ...req.body,
  });
  user.save();
  res.send('注册成功');
})

router.post('/login', function (req, res) {  
  // User.findOne({ ...req.body }).select('name -_id').then(result => {
  User.findOne({ ...req.body }).then(result => {    
    
    console.log(req.body);
    if (result !== null) {
      const data = JSON.parse(JSON.stringify(result));
      data.avatar = `${url}/public/${data.avatar}`;
      res.send({
        status: 200,
        message: '登录成功',
        data,
      });
    } else {
      res.send({
        status: 0,
        message: '登录失败',
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

router.get('/focusList/:id', function (req, res) {
  const { id } = req.params;
  let list = [];
  User.findOne({ _id: id }).then(result => {
    if (result !== null) {

      const ids = result.fans.map(item => item.id);
      User.find({_id: {$in: ids}})
        .then(data => {        
        list = data.map((item) => ({
          name: item.name,
          _id: item._id,
          avatar: `${url}/public/${item.avatar}`,
          date: result.fans.find(value => value.id == item._id).date,
          // 查找focus内是否有新增关注的人
          bothWay: result.focus.some(id => item._id == id),
        }))
        
      }).then(() => {
        res.send({
          status: 200,
          data: {
            list,
          },
        })
      })
    } else {
      res.send({
        status: 0,
        data: {},
      })
    }
  })
})

router.put('/changeFocusStatus', function (req, res) {

  if (req.body.isFocus) {
    Promise.all([
      User.updateOne({ _id: req.body.handler_id}, { $push: { focus: req.body.focus_id } }),
      User.updateOne({ _id: req.body.focus_id }, { $push: { fans: { id: req.body.handler_id, date: req.body.date } } }),
    ])
      .then(([res1, res2]) => {
        res.send({
          status: 200,
          data: {
            message: '关注成功'
          },
        })
      })
      .catch(err => {
        res.send({
          status: 0,
          data: {
            message: '关注失败，请稍后重试'
          },
        })
      })
  } else {

    Promise.all([
      User.findByIdAndUpdate(req.body.handler_id, { $pull: { focus: req.body.focus_id } }),
      User.findByIdAndUpdate(req.body.focus_id, { $pull: { fans: { id: req.body.handler_id } } })
    ])
      .then(([res1, res2]) => {
        console.log(res1,res2);
        
        res.send({
          status: 200,
          data: {
            message: '取消关注成功'
          },
        })
      })
      .catch(err => {
        res.send({
          status: 0,
          data: {
            message: '取消关注失败，请稍后重试'
          },
        })
      })
  }

})

router.put('/editDesc', function (req, res) {
  const params = req.body;
  console.log(params);
  
  User.findByIdAndUpdate(params.user_id, { description: params.desc }, function (err, doc) {
    if (err) {
      res.send({
        status: 0,
        data: {
          message: '修改简介失败'
        }
      })
    } else {
      res.send({
        status: 200,
        data: {
          message: '修改简介成功'
        }
      })
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

router.post('/upload/avatar', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../avatar/');
  form.maxFieldsSize = 1 * 1024 * 1024;
  form.keepExtensions = true;
  form.parse(req, function (err, fields, file) {
   
    var filePath = '';
    //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。  
    if (file.tmpFile) {
      filePath = file.tmpFile.path;
    } else {
      for (var key in file) {
        if (file[key].path && filePath === '') {
          filePath = file[key].path;
          break;
        }
      }
    }
    //文件移动的目录文件夹，不存在时创建目标文件夹  
    var targetDir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(targetDir)) {
      fs.mkdir(targetDir);
    }

    var fileExt = filePath.substring(filePath.lastIndexOf('.'));
    //判断文件类型是否允许上传  
    if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
      var err = new Error('此文件类型不允许上传');
      res.json({
        code: 0,
        message: '此文件类型不允许上传'
      });
    } else {

      //以当前时间戳对上传文件进行重命名  
      var fileName = new Date().getTime() + fileExt;
      var targetFile = path.join(targetDir, fileName);
      //移动文件  
      fs.rename(filePath, targetFile, function (err) {
        if (err) {
          console.info(err);
          res.json({
            status: 0,
            message: '操作失败'
          });
        } else {
          
          User.findOneAndUpdate({
            phoneNum: fields.phoneNum,
          }, {
            avatar: fileName
          }, (err2, doc2) => {          
            
            //上传成功，返回文件的相对路径  
            var avatar = `${url}/public/${fileName}`;
            res.json({
              status: 200,
              avatar,
            });
          })

        }
      });
    }
  });
});

module.exports = router;
