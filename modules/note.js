const mongoose = require('mongoose');
const User = require('./userInfo');
const Schema = mongoose.Schema;

const NotesSchema = new Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  note_detail: {
    type: Object,
    default: {
      note_image: [],
      note_content: '',
    }
  },
  appreciates_num: Number,
  collect_num: Number,
});

const Note = mongoose.model('Note', NotesSchema);

module.exports = Note;

// 笔记表和用户表关联
// 评论表和笔记表关联
// 聊天记录
// 热搜表和笔记表关联
