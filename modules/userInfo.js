const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  phoneNum: String,
  password: String,
  sign: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
    default: 'avatar.jpg'
  },
  description: {
    type: String,
    default: '暂无',
  },
  fans: {
    type: Array,
    default: [],
  },
  focus: {
    type: Array,
    default: [],
  },
  appreciates: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

// 笔记表和用户表关联
// 评论表和笔记表关联
// 聊天记录
// 热搜表和笔记表关联
