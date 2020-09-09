import mongoose from "mongoose";
//creating the user messages schema
const chatSchema = new mongoose.Schema(
  {
    message: String,
    name: String,
    timestamp: String,
    recived: Boolean,
    roomId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chats", chatSchema);
