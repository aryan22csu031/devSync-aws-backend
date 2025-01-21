const validator = require("validator");
const validate = (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("enter a strong password");
  }
};

const validateProfileData = (req,res) => {
  const allowedFields = ["firstName", "lastName", "about", "age", "gender", "skills", "photoUrl", "password"];

  const valid = Object.keys(req.body).every(field => allowedFields.includes(field));

  if(valid){
    return true;
  }else{
    return false;
  }
}

module.exports = {validate, validateProfileData};
