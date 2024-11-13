const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "FirstName is mandatory!"],
      minlength: 3,
      maxlength: 25,
      unique: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      minLength: 8,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not Valid!");
        }
      },
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
      default: "this-is-a-dummy-link-to-a-photo-URL",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
