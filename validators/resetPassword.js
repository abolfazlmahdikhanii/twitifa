const z = require("zod");

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "رمز عبور باید شامل حداقل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد",
    ),
  confirmPassword: z
    .string()
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "رمز عبور باید شامل حداقل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد",
    ),
});

module.exports = passwordSchema;
