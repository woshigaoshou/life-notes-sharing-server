const { Note, User } = require('../modules');
const { url } = require('../public/constant');

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var formidable = require('formidable');

router.get('/list',async (req, res) => {
  const data = await Note.find().populate('author_id', 'avatar name')
  data.forEach(item => {
    console.log(item);
    
    const images = item.note_detail.note_image;
    
    item.note_detail.note_image = images.map(img => `${url}/note/${img}`);
  });

  res.send({
    status: 200,
    data,
  })
})

router.get('/detail/:id', (req, res) => {
  const { id } = req.params;
  res.send(id);
});

module.exports = router;
