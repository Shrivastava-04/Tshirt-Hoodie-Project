import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const URI = process.env.MongoDB_URI;

try {
  mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error: ", error);
}

app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Hell its working!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
