const express = require("express")

const app = express();

app.use("/",(req, res) => {
    res.send("Hello from the lol!")
})
app.use("/test", (req, res) => {
    res.send("Hello from the test!")
})
app.use("/hello", (req, res) => {
    res.send("Hello from the test!")
})

app.listen(7777, () => {
    console.log("Server running successfully on port 7777...");

})  