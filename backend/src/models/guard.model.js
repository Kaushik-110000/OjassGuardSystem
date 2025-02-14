import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const guardSchema = new Schema(
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
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    residence: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    workHistory: [
      {
        location: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "Guard",
    },
  },
  { timestamps: true }
);

// Hash password before saving
guardSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
guardSchema.methods.isPasswordCorrect = async function (tpassword) {
  return await bcrypt.compare(tpassword, this.password);
};

// Generate Access Token
guardSchema.methods.generateAccessToken = function () {
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
guardSchema.methods.generateRefreshToken = function () {
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
export const Guard = mongoose.model("Guard", guardSchema);
