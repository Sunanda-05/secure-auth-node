import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/auth", authRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});