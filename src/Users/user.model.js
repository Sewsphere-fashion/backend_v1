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
    profilePic: { type: String },
    documents: [
      {
        url: { type: String },
        type: {
          type: String,
          enum: ["verification", "payment_proof", "contract"],
        },
        uploadedBy: { type: String, enum: ["designer", "client"] },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default model("User", userSchema);
