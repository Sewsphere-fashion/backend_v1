export const validationMessages = {
  firstname: {
    "any.required": "Please enter firstname",
    "string.empty": "Firstname cannot be empty",
    "string.min": "Firstname must be at least 3 characters long",
    "string.max": "Firstname cannot exceed 50 characters",
  },
  lastname: {
    "any.required": "Please enter lastname",
    "string.empty": "lastname cannot be empty",
    "string.min": "lastname must be at least 3 characters long",
    "string.max": "lastname cannot exceed 50 characters",
  },
  email: {
    "any.required": "Please enter email",
    "string.empty": "Email cannot be empty",
    "string.email": "Please enter a valid email address",
  },
  password: {
    "any.required": "Please enter a password",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 30 characters",
    "string.pattern.base": "Password must include uppercase, lowercase, number, and special character",
  },
  role: {
    "any.required": "Please select a role",
    "string.empty": "Role cannot be empty",
    "any.only": "Selected role is invalid",
  },
   // ----------------- Designer Messages -----------------
  userId: {
    "any.required": "User ID is required",
    "string.base": "User ID must be a string",
    "string.hex": "User ID must be a valid MongoDB ObjectId",
    "string.length": "User ID must be 24 characters long",
  },
  speciality: {
    "any.required": "Please select at least one speciality",
    "array.base": "Speciality must be an array",
    "array.min": "Select at least one speciality",
    "string.base": "Each speciality must be a string",
    "any.only": "Speciality must be one of the allowed options",
  },
  city: {
    "any.required": "Please enter city",
    "string.empty": "City cannot be empty",
    "string.min": "City must be at least 2 characters long",
    "string.max": "City cannot exceed 100 characters",
    "string.base": "City must be a string",
  },
  state: {
    "any.required": "Please enter country",
    "string.empty": "Country cannot be empty",
    "string.min": "Country must be at least 2 characters long",
    "string.max": "Country cannot exceed 100 characters",
    "string.base": "Country must be a string",
  },
  bio: {
    "any.required": "Please enter bio",
    "string.empty": "Bio cannot be empty",
    "string.min": "Bio must be at least 10 characters long",
    "string.max": "Bio cannot exceed 500 characters",
    "string.base": "Bio must be a string",
  },
};