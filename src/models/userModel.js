const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 100,
      enum:[101, 100] // 100-user,  101-admin
    },
    profilePicture: {
      type: Object,
      default: "",
    },
    coverPicture: {
      type: Object,
      default: "",
    },
    about: String,
    livesIn: String,
    worksAt: String,
    relationship: String,
    country: String,
    followers: [],
    following: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);