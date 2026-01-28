import Joi from "joi";

export const waitlistValidation = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid("client", "designer", "interested")
    .optional()
});

