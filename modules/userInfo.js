const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/lifeNotesSharing', function (err) {
  if (err) {
    console.log('连接失败');
  } else {
    console.log('连接成功');
  }
});

const UserSchema = new Schema({
  name: String,
  account: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
