const express = require("express")

const app = express();
const authAdmin = require("./middlewares/auth")

app.use("/admin", authAdmin)


app.get("/admin/getAllUser", (req, res, next) => {

    res.send("All users fetched!!")



})
app.get("/admin/deleteUser", (req, res, next) => {
    res.send("User data deleted!!")
})


app.listen(7777, () => {
    console.log("Server running successfully on port 7777...");

})

