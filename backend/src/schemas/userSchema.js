import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      minLength: 5,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please fill valid email address"],
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function modifyPassword() {
  const user = this;

  // only hash password if modified
  if (!user.isModified("password")) return;

  const SALT = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, SALT);
});

const USER = mongoose.model("USER", userSchema);

export default USER;
