import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["designer", "client", "admin"],
      default: "client",
      required: true,
    },

    // single URL
    profilePic: { type: String },

    // multiple documents
    documents: [
      {
        url: { type: String },
        type: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    designs: [
      // multiple designs images
      {
        url: { type: String },
        title: { type: String },
        description: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default model("User", userSchema);
