const express = require("express")

const app = express();


app.get("/user", (req, res) => {
    res.send({
        firstName: "Varun",
        lastName: "Mangrulkar"
    })
})

app.post("/user", (req, res) => {
    res.send("Data successfully posted to the database!")
})
app.delete("/user",(req,res)=>{
    res.send("Data successfully deleted!")
})


app.listen(7777, () => {
    console.log("Server running successfully on port 7777...");

})

