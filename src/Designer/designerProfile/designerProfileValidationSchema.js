import { validationMessages } from "../../utils/validationMessages.js";
import Joi from "joi";

const DESIGNER_SPECIALITIES = [
 "Custom Pattern Making",
  "Ready-to-wear",
  "Security Wear",
  "Bridal Wear",
  "Children wear",
  "Scrub",
  "Men's Traditional Wear",
  "Wedding Outfit",
  "Embroidery / Beading",
  "Culture Outfit",
  "Corporate wear",
  "Ankara Design",
];

export const DesignerValidator = Joi.object({
  speciality: Joi.array()
    .items(
      Joi.string()
        .trim()
        .valid(...DESIGNER_SPECIALITIES),
    )
    .min(1)
    .required()
    .messages({
      "any.only": `Speciality must be one of ${DESIGNER_SPECIALITIES.join(", ")}`,
    }),

  city: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages(validationMessages.city),

  state: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages(validationMessages.country),

  bio: Joi.string()
    .trim()
    .min(10)
    .max(500)
    .required()
    .messages(validationMessages.bio),
});
