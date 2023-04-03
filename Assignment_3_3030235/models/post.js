const mongoose = require('mongoose');

const { sampleUrl } = require('../config');

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 1000,
  },
  link: {
    type:String,
    // required:true,
    validate: {
      validator: (v) => sampleUrl.test(v),
      message: 'ВВедите ссылку на изображение!! в формате "http://yandex/...."',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  // comments: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'user',
  //   default: [],
  // }],
  comments: [{
      _id: { type: mongoose.Schema.Types.ObjectId },
      text: { type: String },
      name: { type: String },
      user_name: { type: String }
}],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('post', postSchema);
