import mongoose, { Schema } from "mongoose";

const TagsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
});

export const TagsModel = mongoose.model("Tag", TagsSchema);
