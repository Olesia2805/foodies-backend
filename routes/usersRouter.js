import express from "express";

import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
import usersControllers from "../controllers/usersControllers.js";

const userRouter = express.Router();

userRouter.patch("/avatars", upload.single("avatar"), auth, usersControllers.updateUserAvatar);

userRouter.get("/followings", auth, usersControllers.getFollowing);

userRouter.post("/following/:followerId", auth, usersControllers.followUser);

userRouter.delete("/following/:followerId", auth, usersControllers.unfollowUser);

userRouter.get("/followers", auth, usersControllers.getFollowers);

userRouter.get("/:userId", auth, usersControllers.getUserById);

export default userRouter;
