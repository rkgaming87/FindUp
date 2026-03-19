import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "../db";
import authRouter from "../src/Routes/authRouter";
import userRouter from "../src/Routes/userRouter";
import itemRouter from "../src/Routes/itemRouter";
import foundItemRouter from "../src/Routes/foundItemRouter";
import cookieParser from "cookie-parser";
import adminRouter from "../src/Routes/adminRouter";
import claimRouter from "../src/Routes/claimRouter";
import notificationRouter from "../src/Routes/notificationRouter";
import cors from "cors";

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 8005;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://findup-tau.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

dbConnect();

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api", itemRouter);
app.use("/api", foundItemRouter);
app.use("/api/admin", adminRouter);
app.use("/api/claims", claimRouter);
app.use("/api/notifications", notificationRouter);

app.get("/", function (req: express.Request, res: express.Response) {
  res.send("Welcome to FindUp");
  return;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
