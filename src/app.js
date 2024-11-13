const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");

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
  const user = new User(req.body);
  try {
    await user.save({ runValidators: true });
    res.send("data sent without an issue!");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// UPDATE API by ID

app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const updatedUserData = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updatedUserData, {
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("Something went wrong!");
  }
});

//UPDATE API by EmailId

app.patch("/userUpdateByEmail", async (req, res) => {
  const user = req.body.email;
  const updatedUserEmail = req.body;

  try {
    const userUpdated = await User.findOneAndUpdate(
      { email: user },
      updatedUserEmail
    );
    res.send("user email updated");
    console.log(userUpdated);
  } catch (err) {
    res.status(404).send("Something went wrong!!");
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
