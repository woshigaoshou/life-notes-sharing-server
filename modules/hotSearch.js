const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotSearchesSchema = new Schema({
  search_content: {
    type: String,
    default: '',
  },
  priority: {
    type: Number,
    default: 0,
  }
});

const hotSearch = mongoose.model('hotSearch', hotSearchesSchema);

module.exports = hotSearch;

// 笔记表和用户表关联
// 评论表和笔记表关联
// 聊天记录
// 热搜表和笔记表关联
