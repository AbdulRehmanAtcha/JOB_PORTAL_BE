import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UsersRegistrationSchema = new Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required for registration"],
      trim: true,
      enum: {
        values: ["HR", "Candidate"],
        message: "{VALUE} is not supported",
      },
    },
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name atleast have 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    companyName: {
      type: String,
      required: function () {
        return this.role == "HR";
      },
      trim: true,
    },
    designation: {
      type: String,
      required: function () {
        return this.role == "HR";
      },
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^03[0-9]{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "User phone number required"],
    },
    profilePicture: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [5, "Password must have atleast 5 characters"],
    },
    resume: {
      type: String,
      required: function () {
        return this.role === "Candidate";
      },
      trim: true,
    },
  },
  { timestamps: true }
);

UsersRegistrationSchema.pre("save", async function (next) {
  // if (!this.isModified(this.password)) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UsersRegistrationSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const UserModel = mongoose.model("User Model", UsersRegistrationSchema);
