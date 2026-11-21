import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
    return res.json({
        "message" : "API is running successfully",
        "status" : "OK"
    })
});

const port = 8000;

app.listen(port, () => {
    console.log(`API is running successfully`)
});
