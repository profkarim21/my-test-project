import express from "express";
import cors from "cors";
const app = express();

import userRouter from "./modules/Users/user.routes.js";
import postRouter from "./modules/Posts/post.routes.js";
import { connection } from "./DB/connection.js";
 
// Use environment variable for port, with a default value
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Root route for health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running." });
});

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
