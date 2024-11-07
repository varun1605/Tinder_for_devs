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
    await user.save();
    res.send("data sent without an issue!");
  } catch (err) {
    res.status(400).send("Error saving the User!!");
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
