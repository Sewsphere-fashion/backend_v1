import { Schema, model } from "mongoose";
// import { type } from "os";

const designerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    speciality: {
      type: [String],
      enum: [
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
],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    state: {
      type: String,
      required: [true, "state is required"],
    },
    bio: {
      type: String,
      required: [true, "bio is required"],
    },
  },
  { timestamps: true },
);

const designer = model("Designer", designerSchema);

export default designer;
