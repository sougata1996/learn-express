import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { User } from "./types"; // Import the User interface

const router = express.Router();

interface UserRequest extends Request {
  users?: User[];
}

const dataFile = path.resolve(__dirname, "../data/users.json");

// Middleware to add users to the request
const addMsgToRequest = (req: UserRequest, res: Response, next: () => void) => {
  const users = req.app.locals.users;
  if (users) {
    req.users = users;
    next();
  } else {
    return res.status(404).json({ error: "Users not found" });
  }
};

// Route to add a new user
router.post("/adduser", addMsgToRequest, (req: UserRequest, res: Response) => {
  const newuser = req.body as User;
  const users = req.users;

  if (users) {
    users.push(newuser);
    fs.writeFile(dataFile, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.log("Failed to write user");
        res.status(500).send("Failed to write new user");
      } else {
        console.log("User saved");
        res.send("User added successfully");
      }
    });
  } else {
    res.status(500).send("No users data found");
  }
});

export default router;
