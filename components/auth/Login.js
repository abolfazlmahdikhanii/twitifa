"use client";
import { useAuth } from "@/context/AuthContext";
import userSigninSchema from "@/validators/signin";
import { Button, Input, Label, Spinner } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import Icon from "../ui/Icon/Icon";
import AuthWrapper from "./AuthWrapper";

const Login = ({ setActiveTab }) => {
  const { refetch, setFetchingHandler } = useAuth();
  const [isShowLoginPass, setIsShowLoginPass] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const { replace } = useRouter();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      if (!identifier.trim() || !loginPassword.trim()) {
        toast.error("لطفا تمامی فیلد هارا تکمیل کنید");
        return;
      }
      setIsLoginLoading(true);
      const userInfo = { password: loginPassword, identifier };

      const isValid = userSigninSchema.safeParse(userInfo);
      if (!isValid.success) {
        const zodError = z.flattenError(isValid.error);
        Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
          messages.forEach((message) => toast.error(message));
        });
        return;
      }

      const signRes = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      if (signRes.ok) {
        toast.success("ورود با موفقیت انجام شد");
        clearInput();
        refetch();
        replace("/feed");
        setFetchingHandler();
      } else {
        const errorData = await signRes.json();
        throw new Error(errorData.message || "خطا در ورود");
      }
    } catch (error) {
      toast.error(error.message || "خطا در ورود");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const clearInput = () => {
    setIdentifier("");
    setLoginPassword("");
  };

  const inputClass =
    "bg-[#27273A] border border-[#34344E] h-10 sm:h-11.5 md:h-12.5 rounded-[24px] w-full text-sm sm:text-base";

  const iconClass =
    "absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none";

  return (
    <AuthWrapper
      isLogin
      onSubmit={loginHandler}
      changeTab={(e) => setActiveTab(e)}
    >
      <div className="flex flex-col gap-4 sm:gap-5.5">
        {/* identifier */}
        <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
          <Label
            htmlFor="input-type-identifier"
            className="text-xs sm:text-base"
          >
            ایمیل یا نام کاربری
          </Label>
          <div className="relative">
            <Icon name="email" size={20} className={`${iconClass} sm:size-5`} />

            <Input
              id="input-type-identifier"
              placeholder="jane@example.com"
              type="text"
              className={`${inputClass} pr-9 sm:pr-10 pl-3`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.trim())}
            />
          </div>
        </div>

        {/* password */}
        <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="input-type-password"
              className="text-xs sm:text-base"
            >
              رمز عبور
            </Label>

            <Link href={"/auth/forgot-password"} className="sm:text-xs text-[10px] text-blue-500">
              رمز عبور را فراموش کردید؟
            </Link>
          </div>
          <div className="relative">
            <Icon
              name="password"
              size={18}
              className={`${iconClass} sm:size-5`}
            />
            <Input
              id="input-type-password"
              placeholder="••••••••"
              type={isShowLoginPass ? "text" : "password"}
              className={`${inputClass} pr-9 sm:pr-10 pl-10 sm:pl-11`}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value.trim())}
            />
            <Button
              className="absolute top-1/2 -translate-y-1/2 left-1 text-gray-400 "
              variant="ghost"
              isIconOnly
              onClick={() => setIsShowLoginPass((prev) => !prev)}
            >
              {isShowLoginPass ? (
                <Icon name={"eye"} size={18}  className={"size-4"}/>
              ) : (
                <Icon name={"eye-off"} size={18}  className={"size-4"}/>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* submit */}
      <div className="pt-1.5 sm:pt-2 md:pt-3 w-full">
        <Button
          type="submit"
          variant="primary"
          className="py-3 sm:py-3.5 w-full h-10 sm:h-11.5 md:h-13 font-bold text-sm sm:text-base"
          size="lg"
          isDisabled={
            isLoginLoading || !identifier.trim() || !loginPassword.trim()
          }
        >
          {!isLoginLoading ? (
            <>
              ورود به حساب
              <Icon name={"login"} className="mr-0.5 size-4 sm:size-5" />
            </>
          ) : (
            <Spinner color="current" />
          )}
        </Button>
      </div>
    </AuthWrapper>
  );
};

export default Login;
