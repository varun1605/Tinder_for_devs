const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { userAuth } = require("./middlewares/auth");
const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const userData = await User.findOne({ email: email });
//     if (!userData) {
//       throw new Error("Invalid credentials!!");
//     }

//     const isPasswordValid = await userData.validatePassword(password);
//     if (isPasswordValid) {
//       //Only if the email and password is correct then only we will be able to get the userId, which later helps us to generate the jwt.

//       //Creating a JWT token inside the userSchema to keep the code clean and for the best practices.

//       const token = await userData.getJWT();

//       //generating a token indside a cookie.
//       res.cookie("token", token);

//       res.send("Login successful!!!");
//     } else {
//       throw new Error("Invalid credentials!!");
//     }
//   } catch (err) {
//     res.status(404).send("ERROR: " + err.message);
//   }
// });

// app.get("/profile", userAuth, async (req, res) => {
//   try {
//     const user = req.user;

//     res.send(user);
//   } catch (err) {
//     res.status(400).send("ERROR " + err.message);
//   }
// });

// app.post("/signup", async (req, res) => {
//   try {
//     const { firstName, lastName, email, password } = req.body;
//     const hashPassword = await bcrypt.hash(password, 10);
//     validateSignUp(req);
//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashPassword,
//     });
//     await user.save({ runValidators: true });
//     res.send("Data sent successfully!");
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// UPDATE API by ID

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;

  try {
    const skillsAllowedLength = updatedUserData.skills;
    if (skillsAllowedLength.length > 5) {
      throw new Error("Skills cannot be more than 5");
    }

    const ALLOWED_UPDATES = ["gender", "skills"];
    const isAllowed = Object.keys(updatedUserData).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, updatedUserData, {
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("Something went wrong!" + err.message);
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
