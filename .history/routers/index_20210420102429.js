var express = require('express');
var router = express.Router();

const userInfo = require('./userInfo');

router.use('/user', userInfo)

module.exports = router;
