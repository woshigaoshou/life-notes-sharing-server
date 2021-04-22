var express = require('express');
var router = express.Router();
const multer = require('multer');


let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      var changedName = (new Date().getTime())+'-'+file.originalname;
      cb(null, changedName);
    }
  })
});

const userInfo = require('./userInfo');

// router.post('/upload/profilePhoto', upload.single('singleFile'), (req, res) => {
//   console.log(req.file);
//   res.json({
//       code: '0000',
//       type: 'single',
//       originalname: req.file.originalname,
//       path: req.file.path
//   })
// });

router.post('/upload/profilePhoto', function(req, res) {
  console.log(req);
  
});

router.use('/user', userInfo)

module.exports = router;
