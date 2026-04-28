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
        "Bridal Designer",
        "Aso-Ebi Designer",
        "Streetwear Designer",
        "Menswear Designer",
        "Womenswear Designer",
        "Kids Wear Designer",
        "Luxury Fashion Designer",
        "Traditional/Cultural Designer",
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
