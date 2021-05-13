const mongoose = require('mongoose');
const Note = require('./note');
const User = require('./userInfo');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
  note_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Note,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  date: {
    type: String,
  },
  comment_content: {
    type: String,
    require: true,
  },
  comment_appreciates: {
    type: Array,
    default: [],
  }
});

const Comment = mongoose.model('Comment', CommentsSchema);

module.exports = Comment;

// 笔记表和用户表关联
// 评论表和笔记表关联
// 聊天记录
// 热搜表和笔记表关联
