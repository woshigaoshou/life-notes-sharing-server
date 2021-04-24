const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FocusSchema = new Schema({
  name: String,
  phoneNum: String,
  password: String,
  sign: Boolean,
  avatar: String,
  description: String,
  fans: Array,  // 对象，日期， id
  focus: Array, // id
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

// 笔记表和用户表关联
// 评论表和笔记表关联
// 聊天记录
// 热搜表和笔记表关联
