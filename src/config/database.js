const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://varun:Varun@cluster0.rvdrbnt.mongodb.net/"
  );
};

module.exports=connectDb
