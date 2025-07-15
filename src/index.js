import { app } from "./app.js";
import dotenv from "dotenv";
import DBConnectionHandler from "./DB/index.js";
dotenv.config({ path: "./env" });

DBConnectionHandler()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server Started At: ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });
