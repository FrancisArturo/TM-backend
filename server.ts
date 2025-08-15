import express from 'express';
import cors from 'cors';
import { connectDB } from './db/config.ts';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';



const app = express();
const PORT = process.env.PORT || 5000;
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
// app.use("/api/tasks", taskRoutes);
// app.use("/api/reports", reportRoutes);



app.listen( PORT, () => {
    console.log(`Listening on port ${PORT}`);
})



