// CRUD operations

import express from "express";
import Todo from "../models/todo.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all todos
router.get("/", auth, async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user.id});
        res.json(todos);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Add a todo
router.post("/", auth, async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        user: req.user.id
    })
    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Update text and/or mark complete
router.patch("/:id", auth, async (req, res) => {
    try {
        const todo = await Todo.findOne({_id: req.params.id, user: req.user.id});
        if (!todo) {
            return res.status(404).json({message: "Todo not found"});
        }

        if (req.body.text != undefined) {
            todo.text = req.body.text;
        }
        if (req.body.dueDate != undefined) {
            todo.dueDate = req.body.dueDate;
        }
        if (req.body.completed != undefined) {
            todo.completed = req.body.completed;

            todo.completedAt = req.body.completed ? req.body.completedAt : null;
        }

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Delete a todo
router.delete("/:id", auth, async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({_id: req.params.id, user: req.user.id});
        if (!deletedTodo) {
            return res.status(404).json({message: "Todo not found"});
        }
        
        res.json({ message: "Todo deleted" });
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;