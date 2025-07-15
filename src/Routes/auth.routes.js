import { Router } from "express";
import {
  LoginController,
  RegistraionController,
} from "../Controllers/auth.controller.js";
import { validate } from "../Middleware/validate.middleware.js";
import { LoginValidation, RegistraionValidation } from "../Validation/index.js";
import { fileUploadMiddleware } from "../Middleware/file.middleware.js";

const router = Router();

router.post(
  "/register",
  fileUploadMiddleware,
  validate(RegistraionValidation),
  RegistraionController
);

router.post("/login", validate(LoginValidation), LoginController);

export default router;
