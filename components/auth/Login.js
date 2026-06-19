"use client";
import { useAuth } from "@/context/AuthContext";
import userSigninSchema from "@/validators/signin";
import { Button, Input, Label, Spinner } from "@heroui/react";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
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
      const userInfo = {
        password: loginPassword,
        identifier,
      };

      const isValid = userSigninSchema.safeParse(userInfo);
      if (!isValid.success) {
        const zodError = z.flattenError(isValid.error);

        Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(message);
          });
        });
        return;
      }
      const signRes = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log(error);
      toast.error(error.message || "خطا در ورود");
      setIsLoginLoading(false);
    } finally {
      setIsLoginLoading(false);
    }
  };
  const clearInput = () => {
    setIdentifier("");

    setLoginPassword("");
  };
  return (
    <AuthWrapper
      isLogin
      onSubmit={loginHandler}
      changeTab={(e) => setActiveTab(e)}
    >
      <div className="flex  flex-col gap-5.5">
        <div className="flex flex-col gap-2.5 w-full">
          <Label htmlFor="input-type-identifier">ایمیل یا نام کاربری</Label>
          <div className="relative">
            <Mail
              size={20}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
            />
            <Input
              id="input-type-identifier"
              placeholder="jane@example.com"
              type="text"
              className="bg-[#27273A] border border-[#34344E] h-11.5 md:h-12 rounded-[24px] pr-10 pl-3 w-full"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.trim())}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2.5 w-full">
          <Label htmlFor="input-type-password">رمز عبور</Label>
          <div className="relative">
            <Lock
              size={20}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
            />
            <Input
              id="input-type-password"
              placeholder="••••••••"
              type={isShowLoginPass ? "text" : "password"}
              className="bg-[#27273A] border border-[#34344E] h-11.5 md:h-12 rounded-[24px] pr-10 pl-11 w-full"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value.trim())}
            />
            <Button
              className="absolute top-1/2 -translate-y-1/2 left-1 text-gray-400 "
              variant="ghost"
              onClick={() => setIsShowLoginPass((prev) => !prev)}
            >
              {isShowLoginPass ? <Eye /> : <EyeOff />}
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-2 md:pt-3 w-full">
        <Button
          type="submit"
          variant="primary"
          className={" py-3.5 w-full h-11.5 md:h-13 font-bold "}
          size="lg"
          isDisabled={
            isLoginLoading || !identifier.trim() || !loginPassword.trim()
          }
        >
          {!isLoginLoading ? (
            <>
              {" "}
              ورود به حساب <LogIn className="mr-0.5" />{" "}
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
