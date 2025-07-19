import { Router } from "express";
import { TokenMiddleware } from "../Middleware/token.middleware.js";
import { GetJobsCandidate } from "../Controllers/candidate.controller.js";

const router = Router();
router.get("/job", TokenMiddleware, GetJobsCandidate);

export default router;
