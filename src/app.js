import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { seedTags } from "./seedTags.js";

const app = express();
app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cookieParser());

import AuthRoutes from "./Routes/auth.routes.js";
import HrRoutes from "./Routes/hr.routes.js";
import CandidateRoutes from "./Routes/candidate.routes.js";
// seedTags();
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/hr", HrRoutes);
app.use("/api/v1/candidate", CandidateRoutes);

export { app };
