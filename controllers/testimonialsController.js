import Testimonial from "../db/models/testimonial.js";
import User from "../db/models/User.js";

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "email", "avatarURL"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    res.json({
      status: "success",
      code: 200,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Помилка при отриманні відгуків",
    });
  }
};
