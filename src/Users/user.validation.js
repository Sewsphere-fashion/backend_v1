// validations/userValidation.js
import Joi from "joi";
import { validationMessages } from "../utils/validationMessages.js";

export const registerUserValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages(validationMessages.firstname),

  lastName: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages(validationMessages.lastname),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages(validationMessages.email),

  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")
    )
    .required()
    .messages(validationMessages.password),

  role: Joi.string()
    .valid("client", "designer")
    .required()
    .messages(validationMessages.role),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages(validationMessages.email),

  password: Joi.string()
    .trim()
    .required()
    .messages(validationMessages.password),
});

export const loginUserValidationSchema = Joi.object({
   email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required()
    .messages(validationMessages.email),

  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$")
    )
    .required()
    .messages(validationMessages.password)  
})

export const forgotPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
});

export const resetPasswordValidationSchema = Joi.object({
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
    "any.required": "New password is required",
  }),
});

export const resendVerificationValidationSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
});