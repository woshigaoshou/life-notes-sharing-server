const mongoose = require('mongoose');
const Note = require('./note');
const User = require('./userInfo');
const Schema = mongoose.Schema;

const ChatsSchema = new Schema({
  user1_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  user2_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  chat_record: {
    type: Array,
    default: [],
  },
});

const Chat = mongoose.model('Chat', ChatsSchema);

module.exports = Chat;

// 笔记表和用户表关联
// 评论表和笔记表关联
// 聊天记录
// 热搜表和笔记表关联
