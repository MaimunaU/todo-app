import express from "express";
import Habit from "../models/habit.model.js";

const router = express.Router();

// Get all habits
router.get("/", async (req, res) => {
    try {
        const habits = await Habit.find();
        res.json(habits);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Add a habit
router.post("/", async (req, res) => {
    const habit = new Habit({
        name: req.body.name,
        daysOfWeek: req.body.daysOfWeek
    })
    try {
        const newHabit = await habit.save();
        res.status(201).json(newHabit);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Update name and days
router.patch("/:id", async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({message: "Habit not found"});
        }

        if (req.body.name != undefined) {
            habit.name = req.body.name;
        }

        if (req.body.daysOfWeek != undefined) {
            habit.daysOfWeek = req.body.daysOfWeek;
        }

        const updatedHabit = await habit.save();
        res.json(updatedHabit);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.patch("/:id/toggle", async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const date = new Date(req.body.date).toISOString().split("T")[0];
        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }

        const existingLogIdx = habit.logs.findIndex(log => log.date === date);

        if (existingLogIdx >= 0) {
            // remove if already completed (toggle off)
            habit.logs.splice(existingLogIdx, 1);
        } else {
            // add completion
            habit.logs.push({date});
        }

        const updatedHabit = await habit.save();
        res.json(updatedHabit);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Delete a habit
router.delete("/:id", async (req, res) => {
    try {
        const deletedHabit = await Habit.findByIdAndDelete(req.params.id);
        if (!deletedHabit) {
            return res.status(404).json({message: "Habit not found"});
        }
        
        res.json({ message: "Habit deleted" });
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;