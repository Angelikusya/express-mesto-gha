const mongoose = require('mongoose');
// const validator = require('validator');

const cardsShema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    link: {
      type: String,
      required: true,
      // validate: {
      //   validator: (v) => validator.isURL(v),
      //   message: 'Введите корректный URL',
      // },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    // timestamps: true,
  },
);

module.exports = mongoose.model('card', cardsShema);
