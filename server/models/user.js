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
    default: 'https://images.pexels.com/photos/375880/pexels-photo-375880.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
},{
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
