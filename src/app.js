const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    user ? res.send(user) : res.status(404).send("User not found");

    //     const user =await User.find({email:userEmail})
    //     if(user.length===0){
    //       res.status(404).send("User not found")
    //     }else{
    //       res.send(user)
    //     }
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw new Error("Invalid credentials!!");
    }
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (isPasswordValid) {
      res.send("Login successful!!!");
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.send(users);
  } catch {
    res.status(400).send("Something went wrong!!");
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    validateSignUp(req);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save({ runValidators: true });
    res.send("Data sent successfully!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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

app.get("/getUserById", async (req, res) => {
  const userById = req.body._id;

  try {
    const user = await User.findById(userById);
    res.send(user);
  } catch (err) {
    res.status(404).send("Something went worng!!");
  }
});

connectDb()
  .then(() => {
    console.log("Connection established successfully!!");
    app.listen(7777, () => {
      console.log("Server running successfully on port 7777...");
    });
  })
  .catch(() => {
    console.log("Failed to connect to the DB");
  });
