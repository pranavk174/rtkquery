import { Schema } from "mongoose";
import mongoose from "mongoose";

const PostSchema = new Schema({
  id: {
    type: Number,
  },
  title: String,
  body: String,
  tags: [String],
  reaction: {
    likes: String,
    disLikes: String,
  },
  views: Number,
  userId: Number,
});

const PostModel = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default PostModel;
