import mongoose, { model } from "mongoose";
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema(
  {
    name: String,
    familly: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin", "user"],
      required: true,
      default: "user",
    },
    machines: {
      type: [String],
      default: ["dishwasher"],
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || model("User", userSchema);

export default User;
