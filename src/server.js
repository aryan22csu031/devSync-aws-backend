const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connect_db = require("./config/database");
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRoutes");
const requestRouter = require("./routes/requestRoutes");
const userRouter = require("./routes/userRoutes");
const path = require("path");
require("dotenv").config();

const _dirname = path.resolve();

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (req,res) => {
  res.sendFile(path.join(_dirname, "/frontend/dist/index.html"));
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connect_db();
})
