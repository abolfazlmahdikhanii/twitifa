const z = require("zod");

const emailSchema = z.object({
  email: z.email("ایمیل معتبر وارد کنید").toLowerCase().trim(),
});

module.exports = emailSchema;

