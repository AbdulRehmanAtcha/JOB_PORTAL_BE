import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

import AuthRoutes from "./Routes/auth.routes.js";
app.use("/api/v1/auth", AuthRoutes);

export { app };
