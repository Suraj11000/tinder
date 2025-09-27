const validator = require("validator");

const BodyValidator = (req) => {
  console.log("okkk");
  const { FirstName, LastName, Password, Age, Gender, Email } = req.body;
  if (!FirstName || !LastName) {
    throw new Error("Please provide valid name.");
  } else if (!validator.isStrongPassword(Password)) {
    throw new Error("Please Provide a strong password.");
  } else if (!validator.isEmail(Email)) {
    throw new Error("please provide valid email");
  } else if (Gender.includes(["male", "female"])) {
    throw new Error("Gender should be male or female.");
  }
};

const updateUserProfile = (req) => {
  const updatableFields = [
    "FirstName",
    "LastName",
    "Age",
    "Gender",
  ];

   const isValid =  Object.keys(req.body).every(fields => updatableFields.includes(fields))

   if(!isValid){
    throw new Error("Updatation failed.")
   }
};

module.exports = { BodyValidator, updateUserProfile };
