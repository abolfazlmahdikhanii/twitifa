const zod = require("zod");

const userSignupSchema = zod
  .object({
    username: zod
      .string({
        required_error: "نام کاربری الزامی است",
      })
      .min(3, "نام کاربری باید حداقل 3 کاراکتر باشد")
      .max(50, "نام کاربری نباید بیشتر از 50 کاراکتر باشد")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و _ باشد"
      ),

    email: zod
      .email("ایمیل معتبر وارد کنید")
      .toLowerCase()
      .trim(),

    password: zod
      .string()
      .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "رمز عبور باید شامل حداقل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد"
      )
      .optional(),

    provider: zod
      .enum(["credentials", "google"])
      .optional()
      .default("credentials"),

    googleId: zod.string().optional(),

    // image: z.string().url("لینک تصویر معتبر نیست").optional(),
  })
  .refine(
    (data) => {
    
      // اگر provider معمولی است یا تعریف نشده، password الزامی است
      if (!data.provider || data.provider === "credentials") {
        return !!data.password && data.password.length >= 8;
      }
      return true;
    },
    {
      message:
        "رمز عبور برای ثبت نام معمولی الزامی است و باید حداقل 8 کاراکتر باشد",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      // اگر provider گوگل است، googleId الزامی است
      if (data.provider === "google") {
        return !!data.googleId;
      }
      return true;
    },
    {
      message: "googleId برای ثبت نام با Google الزامی است",
      path: ["googleId"],
    }
  );
export default userSignupSchema;
