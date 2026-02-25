import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js"
import { connectDB } from "./config/db.js";
import path from "path";
import cors from "cors";
const PORT = process.env.PORT || 5001

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "https://todo-app-beta-seven-25.vercel.app"
}));

app.use("/api/todos", todoRoutes);
/*
const __dirrname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirrname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.senndFile(path.resolve(__dirrname, "frontend", "dist", "index.html"));
    });
}
*/
app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:5001");
});
