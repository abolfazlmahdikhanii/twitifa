const z = require("zod");

const userSigninSchema = z
  .object({
   
    identifier: z.string().optional(), 
    
    password: z
      .string()
      .trim()
      .min(8, { message: "رمز عبور باید حداقل 8 حرف باشد" })
      .max(100, { message: "رمز عبور باید حداکثر 100 حرف باشد" })
      .optional(),
      
    provider: z.enum(["credentials", "google"]).optional(),
    
    googleId: z.string().optional(),
    
   
    email: z.string().optional(), 
  })
  .refine(
    (data) => {
    
      if (data.provider !== "google") {
        if (!data.identifier) return false;
        
        const value = data.identifier;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(value);

        return isEmail || isUsername;
      }
  
      return true;
    },
    {
      message: "ایمیل یا نام کاربری معتبر وارد کنید",
      path: ["identifier"],
    }
  )
  .refine(
    (data) => {
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