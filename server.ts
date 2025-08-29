import express from 'express';
import cors from 'cors';
import { connectDB } from './db/config.ts';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import taskRoutes from './routes/taskRoutes.ts';
import reportRoutes from './routes/reportRoutes.ts';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';



const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


connectDB();

app.use(cors(
    {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-type", "Authorization"],
    }
))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

app.use("/uploads", express.static(path.join(__dirname,"uploads")));



app.listen( PORT, () => {
    console.log(`Listening on port ${PORT}`);
})



