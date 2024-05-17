const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  online: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    default: 'http://loremflickr.com/60/60/girl',
  },
},{
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
