export const validationMessages = {
  firstname: {
    "any.required": "Please enter firstname",
    "string.empty": "Firstname cannot be empty",
    "string.min": "Firstname must be at least 3 characters long",
    "string.max": "Firstname cannot exceed 50 characters",
  },
  lastname: {
    "any.required": "Please enter surname",
    "string.empty": "Surname cannot be empty",
    "string.min": "Surname must be at least 3 characters long",
    "string.max": "Surname cannot exceed 50 characters",
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
};