import express, { Request, Response } from "express";
import { User } from "./types"; // Import the User interface

const router = express.Router();

interface UserRequest extends Request {
  users?: User[];
}

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

// Route to get all usernames
router.get("/usernames", addMsgToRequest, (req: UserRequest, res: Response) => {
  const usernames = req.users?.map((user) => ({
    id: user.id.toString(),
    username: user.username,
  }));
  res.json(usernames);
});

// Route to get a specific user by username and return email
router.get(
  "/username/:name",
  addMsgToRequest,
  (req: UserRequest, res: Response) => {
    const username = req.params.name;
    const user = req.users?.find((u) => u.username === username);

    if (user) {
      const emailResponse = [
        {
          id: user.id.toString(),
          email: user.email,
        },
      ];
      res.json(emailResponse);
    } else {
      res.json([]);
    }
  }
);

export default router;
