import mongoose, { Schema, Types } from "mongoose";

const JobSchema = new Schema({
  jobMaker: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
    minLength: [3, "Title must have atleast 3 characters"],
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
    trim: true,
    minLength: [3, "Description must have atleast 3 characters"],
  },
  tags: [
    {
      type: Types.ObjectId,
      ref: "Tag",
    },
  ],
  type: {
    type: String,
    enum: {
      values: [
        "Full-time",
        "Internship",
        "Remote",
        "On-site",
        "Hybrid",
        "Contract",
      ],
      message: "{VALUE} is not supported",
    },
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
  },
  companyLogo: {
    type: String,
    required: true,
    trim: true,
    default: "https://placehold.co/60x60?text=Logo",
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
});

export const JobsModel = mongoose.model("Job", JobSchema);
