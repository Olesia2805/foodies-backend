import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Власник відгуку обов'язковий"],
    },
    testimonial: {
      type: String,
      required: [true, "Текст відгуку обов'язковий"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
