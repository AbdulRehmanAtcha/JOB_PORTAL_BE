import { Router } from "express";
import { HrMiddleware } from "../Middleware/hr.middleware.js";
import { fileUploadMiddleware } from "../Middleware/file.middleware.js";
import { JobPostHandler } from "../Controllers/hr.controller.js";
import { jobPostValidation } from "../Validation/index.js";
import { validate } from "../Middleware/validate.middleware.js";

const router = Router();

router.post(
  "/job",
  fileUploadMiddleware,
  validate(jobPostValidation),
  HrMiddleware,
  JobPostHandler
);

export default router;
