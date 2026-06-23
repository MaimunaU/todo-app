import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

const router = express.Router();

// register an account
router.post("/register", async (req, res) => {
    try {
        const username = req.body.username?.trim().toLowerCase();
        const password = req.body.password.trim();
        if (!username || !password) {
            return res.status(400).json({message: "Username and password are required"});
        }
        if (username.length < 3 || username.length > 10) {
            return res.status(400).json({message: "Username must be between 3-10 chars long"});
        }
        if (password.length < 8) {
            return res.status(400).json({message: "Password must be atleast 8 chars long"});
        }

        const existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).json({message: "Username not available"});
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPass
        });

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(201).json({token, user:{id: user._id, username: user.username}});
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

// login to account
router.post("/login", async (req, res) => {
    try {
        const username = req.body.username?.trim().toLowerCase();
        const password = req.body.password.trim();
        if (!username || !password) {
            return res.status(400).json({message: "Username and password are required"});
        }

        const user = await User.findOne({username});
        if (!user) {
            return res.status(401).json({message: "Invalid login"})
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(401).json({message: "Invalid login"})
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.status(200).json({token, user:{id: user._id, username: user.username}});
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

// get current user
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
})

export default router;