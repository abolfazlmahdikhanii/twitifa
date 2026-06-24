"use client";
import passwordSchema from "@/validators/resetPassword";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
  Spinner,
} from "@heroui/react";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { replace } = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!password.trim() || !confirmPassword.trim()) {
        toast.error("لطفا تمامی فیلد هارا تکمیل کنید");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("رمز عبور و تکرار آن یکسان نیستند");
        return;
      }
      const userInfo = {
        password,
        confirmPassword,
      };
      // validate
      const isValid = passwordSchema.safeParse(userInfo);
      if (!isValid.success) {
        const zodError = z.flattenError(isValid.error);

        Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(message);
          });
        });

        return;
      }
      setIsLoading(true);
      const res = await fetch(`/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success("رمز عبور با موفقیت تغییر کرد");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          replace("/auth");
        }, 1000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "خطا در تغییر رمز عبور");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "خطا در تغییر رمز عبور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mt-14 md:mt-0 md:w-120 rounded-2xl border border-[#34344E] bg-[#1e1e2e] overflow-hidden shadow-md">
      <Card variant="transparent" className="p-0 pt-8.5 rounded-none">
        <CardHeader className="flex flex-col items-center justify-center gap-y-2.5 mb-5">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#7b6ffd]/15 ring-1 ring-[#7b6ffd]/20">
            <KeyRound className="h-7 w-7 text-[#a89bff]" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-center font-[Syne] text-xl font-bold text-white">
              تنظیم رمز عبور جدید
            </h1>
            <p className="mt-2 text-center text-sm leading-6 text-white/45 px-2">
              لطفاً رمز عبور جدید خود را وارد کنید. برای امنیت بیشتر، از ترکیب
              حروف و اعداد استفاده کنید.
            </p>
          </div>
        </CardHeader>

        <CardContent className="md:px-8 px-6">
          <form
            className="w-full flex flex-col gap-5 items-center justify-center"
            onSubmit={handleSubmit}
          >
            <div className="relative w-full">
              <Lock
                size={20}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
              />
              <Input
                id="input-type-password-reg"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                className="bg-[#27273A] border border-[#34344E] h-11.5 md:h-12 rounded-[24px] pr-10 pl-11 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
              />
              <Button
                className="absolute top-1/2 -translate-y-1/2 left-1 text-gray-400 "
                variant="ghost"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </Button>
            </div>

            <div className="relative w-full">
              <Lock
                size={20}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
              />
              <Input
                id="input-type-password-reg"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                className="bg-[#27273A] border border-[#34344E] h-11.5 md:h-12 rounded-[24px] pr-10 pl-11 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.trim())}
              />
              <Button
                className="absolute top-1/2 -translate-y-1/2 left-1 text-gray-400 "
                variant="ghost"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </Button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isDisabled={
                isLoading || !password.trim() || !confirmPassword.trim()
              }
              className="py-3.5 w-full h-11.5 md:h-13 font-bold mt-5 mb-3"
            >
              {isLoading ? (
                <Spinner size="sm" className="text-current" />
              ) : (
                "ذخیره رمز عبور جدید"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-[#151525] p-4 w-full rounded-none flex items-center justify-center mt-5">
          <Link
            href="/auth"
            className="flex items-center gap-1.5 text-[13px] font-semibold text-white/65 transition-colors hover:text-white"
          >
            بازگشت به صفحه ورود
            <ArrowLeft size={14} />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
