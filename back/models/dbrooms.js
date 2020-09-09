import mongoose from "mongoose";
const roomsSchema = new mongoose.Schema(
  {
    name: String,
    messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chats'
        }
      ]  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Rooms", roomsSchema);
