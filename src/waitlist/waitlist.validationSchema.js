import Joi from "joi";

const waitlistValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string()
    .valid("client", "designer", "interested")
    .optional()
});

export default waitlistValidationSchema;