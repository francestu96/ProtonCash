import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    requeired: true,
    unique: true,
  },
  telegramId: {
    type: String,
    requeired: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
