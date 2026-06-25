"use client";
import { useAuth } from "@/context/AuthContext";
import emailSchema from "@/validators/email";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
  Label,
  Spinner,
} from "@heroui/react";
import { KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import Icon from "../ui/Icon/Icon";

const ForgetPassword = () => {
  const { showOtpHandler } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    try {
      if (!email.trim()) {
        toast.error("لطفا تمامی فیلد هارا تکمیل کنید");
        return;
      }
      setIsLoading(true);
      const userInfo = { email };

      const isValid = emailSchema.safeParse(userInfo);
      if (!isValid.success) {
        const zodError = z.flattenError(isValid.error);
        Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
          messages.forEach((message) => toast.error(message));
        });
        return;
      }

      const resetPasswordRes = await fetch("/api/auth/reset-password/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (resetPasswordRes.ok) {
        showOtpHandler(email);
      } else {
        const errorData = await resetPasswordRes.json();
        throw new Error(errorData.message || "خطا در تایید ایمیل");
      }
    } catch (error) {
      toast.error(error.message || "خطا در تایید ایمیل");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mt-8 sm:mt-14 md:mt-0 md:w-120 rounded-xl sm:rounded-2xl border border-[#34344E] bg-[#1e1e2e] overflow-hidden shadow-md">
      <Card variant="transparent" className="p-0 pt-6 sm:pt-8.5 rounded-none">

        <CardHeader className="flex flex-col items-center justify-center gap-y-2 sm:gap-y-2.5 mb-3 sm:mb-5">
          {/* Icon */}
          <div className="mx-auto mb-3 sm:mb-4 flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[#7b6ffd]/15 ring-1 ring-[#7b6ffd]/20">
            <Icon name="key" className="h-5 w-5 sm:h-7 sm:w-7 text-[#a89bff]" strokeWidth={1.75} />
          </div>

          <div className="flex flex-col gap-1 sm:gap-1.5 text-center px-2">
            <h1 className="text-lg sm:text-xl font-bold text-white">
              بازیابی رمز عبور
            </h1>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-6 text-white/45">
              برای دریافت کد تایید، ایمیل خود را وارد کنید.
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 md:px-8">
          <form
            className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5.5 items-center justify-center"
            onSubmit={resetPasswordHandler}
          >
            <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
              <Label htmlFor="input-type-email-reg" className="text-sm sm:text-base">
                ایمیل
              </Label>
              <div className="relative">
                <Icon name="email"
                  size={18}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none sm:size-5"
                />
                <Input
                  id="input-type-email-reg"
                  placeholder="jane@example.com"
                  type="email"
                  className="bg-[#27273A] border border-[#34344E] h-10 sm:h-11.5 md:h-13 rounded-[24px] pr-9 sm:pr-10 pl-3 w-full text-sm sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isDisabled={isLoading || !email.trim()}
              className="py-3 sm:py-3.5 w-full h-10 sm:h-11.5 md:h-13 font-bold mt-3 sm:mt-4.5 mb-2 sm:mb-3 text-sm sm:text-base"
            >
              {isLoading ? (
                <Spinner size="sm" className="text-current" />
              ) : (
                "ارسال کد تایید"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-[#151525] p-3 sm:p-4 w-full rounded-none flex items-center justify-center mt-3 sm:mt-5">
          <p className="text-center text-[11px] sm:text-[13px] text-white/45">
            رمز عبور خود را به یاد دارید؟{" "}
            <Link
              href="/auth"
              className="font-semibold text-[#a89bff] transition-colors hover:text-[#7b6ffd]"
            >
              بازگشت به ورود
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgetPassword;