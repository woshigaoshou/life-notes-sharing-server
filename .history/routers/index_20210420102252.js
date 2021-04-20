var express = require('express');
var router = express.Router();

const userInfo = require('./userInfo');

router.user('/user', userInfo)

module.exports = router;
