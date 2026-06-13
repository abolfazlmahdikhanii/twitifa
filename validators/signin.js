const z = require("zod");

const userSigninSchema = z
  .object({
    identifier: z.string().min(3, "ایمیل یا نام کاربری الزامی است"),
    password: z
      .string()
      .trim()
      .min(8, { message: "رمز عبور باید حداقل 8 حرف باشد" })
      .max(100, { message: "رمز عبور باید حداکثر 100 حرف باشد" })
      .optional(),
    provider: z.enum(["credentials", "google"]).optional(),
    googleId: z.string().optional(),
  })
  .refine(
    (data) => {
      const value = data.identifier;

      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(value);

      return isEmail || isUsername;
    },
    {
      message: "ایمیل یا نام کاربری معتبر وارد کنید",
      path: ["identifier"],
    }
  )
  .refine(
    (data) => {
      // اگر Google نیست، password الزامیه
      if (data.provider !== "google") {
        return !!data.password;
      }
      return true;
    },
    {
      message: "رمز عبور الزامی است",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      // اگر Google هست، googleId الزامیه
      if (data.provider === "google") {
        return !!data.googleId;
      }
      return true;
    },
    {
      message: "googleId برای ورود با Google الزامی است",
      path: ["googleId"],
    }
  );

module.exports = userSigninSchema;
