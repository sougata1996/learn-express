import fs from "fs";
import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { User } from "./types"; // Import the User interface
import readUsersRouter from "./readUsers";
import writeUsersRouter from "./writeUsers";

const app: Express = express();
const port: number = 8000;
const dataFile = path.resolve(__dirname, "../data/users.json");

let users: User[] = [];

// Read users from file when the server starts
fs.readFile(dataFile, (err, data) => {
  if (err) throw err;
  users = JSON.parse(data.toString());
  app.locals.users = users;
  console.log("Users loaded");
});

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the modularized routes
app.use("/read", readUsersRouter);
app.use("/write", writeUsersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
