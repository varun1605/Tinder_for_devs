const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email,password } = req.body;
  if (!firstName && !lastName) {
    throw new Error("FirstName or lastName cannot be empty");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email Id");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Enter a strong password")
  }
};
module.exports = {
  validateSignUp,
};
