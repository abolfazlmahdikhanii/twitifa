"use client";
import { Button } from "@heroui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const GoogleBtn = ({ isLogin }) => {
  const router = useRouter();
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      const token = credentialResponse.access_token;
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const userData = await response.json();
        if (!userData) throw Error();

        const userInfo = {
          googleId: userData.sub,
          avatar: userData.picture,
          email: userData.email,
          username: userData.email.split("@")[0],
          provider: "google",
        };

        const endpoint = isLogin ? "/api/auth/signin" : "/api/auth/signup";
        const signRes = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInfo),
        });

        if (signRes.ok) {
          toast.success(
            isLogin ? "ورود با موفقیت انجام شد" : "ثبت نام با موفقیت انجام شد",
          );
          router.replace("/feed");
        } else {
          throw Error();
        }
      } catch (error) {
        toast.error(
          isLogin ? "ورود با مشکل مواجه شد" : "ثبت نام با مشکل مواجه شد",
        );
      }
    },
    onError: () => {
      toast.error("مشکل در دریافت اطلاعات مجدد امتحان کنید");
    },
  });

  return (
    <Button
      onPress={() => login()}
      className="w-full flex items-center justify-center gap-2 sm:gap-3  rounded-4xl dark:bg-white px-3 sm:px-4 py-2 sm:py-3 h-10 sm:h-11 md:h-12.5 font-medium text-xs sm:text-base text-[#0F172A] dark:hover:bg-white/80 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6.5 sm:[&>svg]:h-6.5 transition-all duration-200 touch-manipulation"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24"
        height="24"
      >
        <path1
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
        />
        <path
          fill="#FF3D00"
          d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
        />
      </svg>
      {isLogin ? "ورود با گوگل" : "ثبت نام با گوگل"}
    </Button>
  );
};

export default GoogleBtn;
