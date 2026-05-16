import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    daysOfWeek: {
        type: [Number], // 0:sun - 6:sat,
        default: [0, 1, 2, 3, 4, 5, 6] // everyday/daily
    },
    logs: [
        {
            date: {
                type: String,
                required: true
            },
            completed: {
                type: Boolean,
                default: true
            }
        }
    ],
    streak: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;