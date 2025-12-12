import express from "express";
import cors from "cors";
const app = express();
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./modules/Users/user.routes.js";
import postRouter from "./modules/Posts/post.routes.js";
import { connection } from "./DB/connection.js";

// Use environment variable for port, with a default value
const PORT = process.env.PORT || 3000;

// Setup for serving static files correctly with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve the frontend application
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API routes
app.use("/user", userRouter);
app.use("/post", postRouter);

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Connect to DB then start the server
connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database.", err);
  });
