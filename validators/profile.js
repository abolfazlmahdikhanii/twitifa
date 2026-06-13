const z = require("zod");

const userProfileSchema = z
  .object({
    accountType: z.enum(["personal", "legal"]).default("personal"),
    firstName: z
      .string()
      .trim()
      .min(2, { message: "نام باید حداقل 2 حرف باشد" })
      .optional(),
    lastName: z
      .string()
      .trim()
      .min(2, { message: "نام خانوادگی باید حداقل 2 حرف باشد" })
      .optional(),
    organizationName: z
      .string()
      .trim()
      .min(2, { message: "نام شرکت یا سازمان باید حداقل 2 حرف باشد" })
      .optional(),
    // ملیت
    nationality: z
      .string()
      .trim()
      .min(2, { message: "لطفاً ملیت خود را انتخاب کنید" })
      .or(z.literal(""))
      .optional(),

    // موقعیت مکانی
    location: z
      .string()
      .trim()
      .min(2, { message: "لطفاً موقعیت مکانی را وارد کنید" })
      .or(z.literal(""))
      .optional(),
    // درباره من
    bio: z
      .string()
      .trim()
      .min(4, { message: "لطفاً درباره خود را وارد کنید" })
      .max(350, { message: "حداکثر 350 حرف مجاز است" })
      .or(z.literal(""))
      .optional(),
    // جنسیت
    gender: z
      .enum(["male", "female"], {
        errorMap: () => ({ message: "لطفاً جنسیت خود را انتخاب کنید" }),
      })
      .or(z.literal(""))
      .optional(),

    // تاریخ تولد (شمسی)
    birthDate: z.iso
      .datetime({ message: "فرمت تاریخ تولد نامعتبر است" })
      .or(z.literal(""))
      .optional(),

    // شغل / حوزه فعالیت
    occupation: z
      .string()
      .trim()
      .min(2, { message: "لطفاً شغل یا حوزه فعالیت خود را وارد کنید" })
      .or(z.literal(""))
      .optional(),

    // وبسایت
    website: z
      .url({ message: "لطفاً یک آدرس وبسایت معتبر وارد کنید از http یا https ابتدای آدرس استفاده کنید." })
      .optional()
      .or(z.literal(""))
      .optional(),

    // آدرس دفتر مرکزی
    address: z
      .string()
      .trim()
      .min(10, { message: "آدرس دفتر مرکزی باید حداقل 10 حرف باشد" })
      .or(z.literal(""))
      .optional(),
  })
  .refine(
    (data) => {
      if (data.accountType === "personal") {
        // حساب شخصی: نام و نام خانوادگی الزامی
        return (
          typeof data.firstName === "string" &&
          data.firstName.trim().length > 0 &&
          typeof data.lastName === "string" &&
          data.lastName.trim().length > 0
        );
      }

      if (data.accountType === "legal") {
        // حساب حقوقی: فقط organizationName الزامی
        return (
          typeof data.organizationName === "string" &&
          data.organizationName.trim().length > 0
        );
      }

      return true;
    },
    {
      message: "لطفاً فیلدهای مورد نیاز را تکمیل کنید",
      path: ["accountType"], // می‌توانی مسیر خطا را تغییر دهی
    },
  )
  .refine(
    (data) => {
      if (!data.birthDate) return true;

      // بررسی معتبر بودن تاریخ تولد (نباید در آینده باشد)
      const birthDate = new Date(data.birthDate);
      const now = new Date();
      const minDate = new Date();
      minDate.setFullYear(now.getFullYear() - 150); // 150 سال پیش

      return birthDate >= minDate && birthDate <= now;
    },
    {
      message: "تاریخ تولد نامعتبر است",
      path: ["birthDate"],
    },
  )
  .refine(
    (data) => {
      if (!data.birthDate||data.accountType==="legal") return true;

      // بررسی حداقل سن (مثلاً 13 سال)
      const birthDate = new Date(data.birthDate);
      const now = new Date();
      const minAgeDate = new Date();
      minAgeDate.setFullYear(now.getFullYear() - 13);

      return birthDate <= minAgeDate;
    },
    {
      message: "سن شما باید حداقل 13 سال باشد",
      path: ["birthDate"],
    },
  );

module.exports = userProfileSchema;
