const { hotSearch } = require('../modules');
const { url } = require('../public/constant');

var express = require('express');
var router = express.Router();

router.get('/fetch', async (req, res) => {
  const data = await hotSearch.find({}).sort({priority: -1}).limit(6);
  // const data = hotSearch.find({}).sort({'priority': 1}).limit(6);
  // console.log(data);
  
  res.send({
    status: 200,
    data: JSON.parse(JSON.stringify(data)),
  });
});

router.post('/add', async (req, res) => {
  const { keyword } = req.body;
  const data = await hotSearch.find({ 'search_content': { $regex: new RegExp(keyword, 'i') } });
  if (data.length === 0) {
    const search = new hotSearch({
      search_content: keyword,
      priority: 0,
    });
    search.save();
  } else {
    const data = await hotSearch.update({'search_content': { $regex: new RegExp(keyword, 'i') } }, {$inc:{priority: 1}});    
  }
  
  res.send({
    status: 200,
    msg: '增加优先级成功',
  });
});


module.exports = router;
