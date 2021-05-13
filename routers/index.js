var express = require('express');
var router = express.Router();

const userInfo = require('./userInfo');
const note = require('./note');
const comment = require('./comment');
const chat = require('./chat');
const hotSearch = require('./hotSearch');

// router.post('/upload/profilePhoto', upload.single('singleFile'), (req, res) => {
//   console.log(req.file);
//   res.json({
//       code: '0000',
//       type: 'single',
//       originalname: req.file.originalname,
//       path: req.file.path
//   })
// });

router.use('/user', userInfo);
router.use('/note', note);
router.use('/comment', comment);
router.use('/chat', chat);
router.use('/hotSearch', hotSearch);

module.exports = router;
