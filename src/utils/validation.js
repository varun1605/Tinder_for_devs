const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName && !lastName) {
    throw new Error("FirstName or lastName cannot be empty");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateUserEditData = (req) => {
  const allowedDataToEdit = [
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "skills",
    "photoURL",
  ];

  const validEditdKeys = Object.keys(req.body).every((field) =>
    allowedDataToEdit.includes(field)
  );
  return validEditdKeys;
};
module.exports = {
  validateSignUp,
  validateUserEditData,
};
