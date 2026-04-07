const Joi = require("joi"); // joi returns a class, and we use pascal naming conventions for a class

//joi schema
const courseSchema = Joi.object({
  coursename: Joi.string().min(3).max(100).required(),
  enrollment: Joi.number().positive().required(),
});

const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(), // Makes the field mandatory,
});

const validateCourse = (course) => {
  return courseSchema.validate(course);
};

const validateUser = (user) => {
  return userSchema.validate(user);
};
module.exports = { validateCourse, validateUser }; 
