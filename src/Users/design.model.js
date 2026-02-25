import { Schema, model } from "mongoose";

const designSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  url: String,
  title: String,
  description: String,
  featured: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
});


export default model("Design",designSchema)