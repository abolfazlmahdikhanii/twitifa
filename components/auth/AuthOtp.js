"use client";
import { useAuth } from "@/context/AuthContext";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  InputOTP,
  REGEXP_ONLY_DIGITS,
  Spinner,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const slotClass =
  "bg-[#27273A] border border-[#34344E] size-12.5 md:size-13.25 rounded-2xl";

const maskEmail = (email = "") => {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  const visible = user.slice(0, 2);
  const masked = "*".repeat(Math.max(user.length - 2, 2));
  return `${visible}${masked}@${domain}`;
};

const AuthOtp = ({ isReset = false }) => {
  const { refetch, tempEmail, clearEmailTemp, closeOtpHandler } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(180);
  const [resendLoading, setResendLoading] = useState(false);
  const { replace } = useRouter();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const verifyCode = async (code) => {
    if (loading) return;

    if (code.length < 4) {
      const errorMsg = "لطفاً کد ۴ رقمی را به‌صورت کامل وارد کنید";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setError("");
    setLoading(true);

    const endpoint = isReset
      ? "/api/auth/reset-password/verify-email"
      : "/api/auth/verify-email";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempEmail, code }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isReset ? data.message : "ثبت نام با موفقیت انجام شد");

        if (isReset) {
          replace("/auth/reset-password");
          closeOtpHandler();
        } else {
          refetch();
          replace("/feed");
          clearEmailTemp();
          closeOtpHandler();
        }
      } else {
        if (res.status === 429) {
          toast.error(data.message || "کد وارد شده صحیح نیست");
          setTimeout(() => {
            closeOtpHandler();
          }, 800);
        } else {
          toast.error(data.message || "کد وارد شده صحیح نیست");
          setError(data.message || "کد وارد شده صحیح نیست");
          if (data.remainingAttempts !== undefined) setOtp("");
        }
      }
    } catch (err) {
      toast.error("خطا در ارتباط با سرور");
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyCode(otp);
  };

  const handleResend = async () => {
    setError("");
    setResendLoading(true);

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setCooldown(180);
        setOtp("");
        toast.success("کد مجدد ارسال شد");
      } else {
        toast.error(data.message || "ارسال مجدد کد با خطا مواجه شد");
        setError(data.message || "ارسال مجدد کد با خطا مواجه شد");
      }
    } catch (err) {
      toast.error("خطا در ارتباط با سرور");
      setError("خطا در ارتباط با سرور");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full mt-14 md:mt-0 md:w-120 rounded-2xl border border-[#34344E] bg-[#1e1e2e] overflow-hidden shadow-md">
      <Card variant="transparent" className="p-0 pt-8.5 rounded-none">
        <CardHeader className="flex flex-col items-center justify-center gap-y-2.5 mb-5">
          <div className="flex flex-col gap-1.5 text-center">
            <p className="text-2xl font-extrabold tracking-tight text-[#e7e9ea] sm:text-[26px]">
              کد تایید برات فرستادیم
            </p>
            <p className="text-sm leading-relaxed text-[#71767b] mt-2">
              کد ۴ رقمی که برای{" "}
              <span className="text-[#e7e9ea]">{maskEmail(tempEmail)}</span>{" "}
              فرستادیم رو وارد کن.
            </p>
          </div>
        </CardHeader>
        <CardContent className="md:px-8 px-6">
          <form
            className="w-full flex flex-col gap-4 md:gap-5.5 items-center justify-center"
            onSubmit={handleSubmit}
          >
            <InputOTP
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (error) setError("");
              }}
              // FIX: Call the correct verification function based on isReset
              onComplete={() => verifyCode(otp)}
              maxLength={4}
              pattern={REGEXP_ONLY_DIGITS}
              isInvalid={!!error}
              isDisabled={loading}
              autoFocus
              className="mt-3.5"
            >
              <InputOTP.Group className="gap-4">
                <InputOTP.Slot index={3} className={slotClass} />
                <InputOTP.Slot index={2} className={slotClass} />
                <InputOTP.Slot index={1} className={slotClass} />
                <InputOTP.Slot index={0} className={slotClass} />
              </InputOTP.Group>
            </InputOTP>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isDisabled={otp.length < 4 || loading || !!error}
              className="py-3.5 w-full h-11.5 md:h-13 font-bold mt-6.5 mb-3"
            >
              {loading ? (
                <Spinner size="sm" className="text-black" />
              ) : (
                "تایید کد"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-[#151525] p-4 w-full rounded-none flex items-center justify-center">
          {cooldown > 0 ? (
            <p className="text-sm text-[#71767b]">
              ارسال مجدد کد:{" "}
              <span className="font-semibold text-[#e7e9ea]" dir="ltr">
                {formatTime(cooldown)}
              </span>
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onPress={handleResend}
              isDisabled={resendLoading}
              className="text-sm text-[#1d9bf0] transition-colors hover:underline disabled:opacity-50"
            >
              {resendLoading
                ? "در حال ارسال..."
                : "کد رو نگرفتید؟ دوباره بفرست"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthOtp;
