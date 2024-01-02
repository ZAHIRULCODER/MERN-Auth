import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//importing routes
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		methods: ["GET", "POST", "PUT", "PATCH"],
		credentials: true,
	})
);
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
	res.send("Hello from express. For testing");
});

//routes declaration
app.use("/api/v1/users", userRouter);

// http://localhost:3000/api/v1/users/register

export { app };
