const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");
const cors = require("cors");

const corsOptions = {
  //Whitelisting the frontend domain URL to allow the cookies to be set.
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;

  try {
    const skillsAllowedLength = updatedUserData.skills;
    if (skillsAllowedLength.length > 5) {
      return res.status(400).send("Skills cannot be more than 5");
    }

    const ALLOWED_UPDATES = ["gender", "skills"];
    const isAllowed = Object.keys(updatedUserData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowed) {
      return res.status(400).send("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, updatedUserData, {
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    return res.status(500).send("Something went wrong! " + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Connection established successfully!!");
    app.listen(8080, () => {
      console.log("Server running successfully on port 8080...");
    });
  })
  .catch(() => {
    console.log("Failed to connect to the DB");
  });
