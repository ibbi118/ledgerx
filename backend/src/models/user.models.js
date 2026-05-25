const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email",
      ],
    },

    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      unique: true,
      minlength: [3, "username must be at least 3 characters"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be at least 6 characters"],
      select: false, // 🔐 hide password by default
    },
    systemUser : {
      type : Boolean,
      default : false,
      immutable : true,
      select : false
    }
  },
  {
    timestamps: true,
  }
);



// # 🚀 INDEXES (Important for performance)

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });




// # 🔐 PRE HOOK (Password Hashing)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.log(error);
  }
});



// # 🔑 METHOD (Compare Password)

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



// # 📦 EXPORT MODEL

const User = mongoose.model("User", userSchema);
module.exports = User;