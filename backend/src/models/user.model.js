import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true, // Fixed typo (was lowerCase)
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Fixed typo (was lowerCase)
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary URL
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Prevent password from being queried accidentally
    },
    refreshToken: {
      type: String,
      select: false, // Prevent token exposure in queries
    },
    role: {
      type: String,
      required: true,
      default: "user", // Default role
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.isPasswordCorrect = async function (tpassword) {
  return await bcrypt.compare(tpassword, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      userName: this.userName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Export Model
export const User = mongoose.model("User", userSchema);
