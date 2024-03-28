import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    let user;

    user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await user.save();

    if (user) {
      generateTokenAndSetCookie(user._id, res);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      });
    } else {
      res.status(400).json({ error: "Invalid user data." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signupUser: ", error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(400)
        .json({ error: "Invalid username. please try again." });

    const isPasswordMatched = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatched)
      return res
        .status(400)
        .json({ error: "Invalid password. please try again." });

    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signupUser: ", error.message);
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("name", req.user.name);

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    console.log("userToModify", userToModify);

    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in followUnFollowUser: ", error.message);
  }
};
