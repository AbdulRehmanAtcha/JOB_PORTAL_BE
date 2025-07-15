import CloudinaryService from "../Config/cloudinary.js";
import { UserModel } from "../Models/auth.model.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";

export const RegistraionController = async (req, res) => {
  try {
    const { role, fullName, email, companyName, designation, phone, password } =
      req.body;

    const profilePictureFile = req.files?.profilePicture?.[0];
    const resumeFile = req.files?.resume?.[0];

    let uploadedImage, uploadedPDF;

    if (profilePictureFile) {
      uploadedImage = await CloudinaryService.uploadImage(
        profilePictureFile.buffer,
        profilePictureFile.originalname
      );
    }

    if (resumeFile) {
      uploadedPDF = await CloudinaryService.uploadPDF(
        resumeFile.buffer,
        resumeFile.originalname
      );
    }

    if (role === "Candidate" && !resumeFile) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Candidate resume is required."));
    }

    const userData = {
      role,
      fullName,
      email,
      phone,
      password,
      profilePicture: uploadedImage?.secure_url || null,
      resume: uploadedPDF?.secure_url || null,
      ...(role === "HR" && {
        companyName,
        designation,
      }),
    };

    const user = await UserModel.create(userData);
    const { password: _, ...safeUser } = user.toObject();

    return res
      .status(200)
      .json(new ApiResponse(200, safeUser, "Registration successful"));
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, error?.message || "Internal Server Error")
      );
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req?.body;

    const emailUser = await UserModel.findOne({ email: email });
    if (!emailUser) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid email or password"));
    }

    const passwordChecker = await emailUser.isPasswordCorrect(password);
    if (!passwordChecker) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid email or password"));
    }

    const payload = {
      id: emailUser?._id,
    };
    const options = {
      expiresIn: "10d",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);

    // Postman
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return res.status(500).json(new ApiResponse(500, emailUser, "Email Find"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, error?.message || "Internal Server Error")
      );
  }
};
