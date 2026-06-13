"use client";
import {
  Card,
  Form,
  Input,
  Tabs,
  CardHeader,
  CardContent,
  Label,
  Button,
  CardFooter,
  Spinner,
} from "@heroui/react";
import { Eye, EyeOff, Lock, LogIn, Mail, User, UserPlus } from "lucide-react";
import React, { useState } from "react";
import GoogleBtn from "./GoogleBtn";
import { GoogleLogin } from "@react-oauth/google";
import AuthWrapper from "./AuthWrapper";
import { toast } from "sonner";
import userSigninSchema from "@/validators/signin";
import userSignupSchema from "@/validators/signup";
import z from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const AuthForm = () => {
  const { refetch, setFetchingHandler } = useAuth();
  const [isShowLoginPass, setIsShowLoginPass] = useState(false);
  const [isShowRegisterPass, setIsShowRegisterPass] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
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
        setIdentifier("");
        setLoginPassword("");
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
  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      if (!username.trim() || !email.trim() || !registerPassword.trim()) {
        toast.error("لطفا تمامی فیلد هارا تکمیل کنید");
        return;
      }
      setIsRegisterLoading(true);
      const userInfo = {
        password: registerPassword,
        email,
        username,
      };
      // validate
      const isValid = userSignupSchema.safeParse(userInfo);
      if (!isValid.success) {
        const zodError = z.flattenError(isValid.error);

        Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(message);
          });
        });

        return;
      }
      // signup
      const signRes = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      if (signRes.ok) {
        toast.success("ثبت نام با موفقیت انجام شد");
        setEmail("");
        setRegisterPassword("");
        setUsername("");
        refetch();
        replace("/feed");
        setFetchingHandler();
      } else {
        const errorData = await signRes.json();
        console.log(errorData);
        throw new Error(errorData.message || "خطا در ثبت نام");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "خطا در ثبت نام");
      setIsRegisterLoading(false);
    } finally {
      setIsRegisterLoading(false);
    }
  };
  const clearInput = () => {
    setIdentifier("");
    setEmail("");
    setLoginPassword("");
    setRegisterPassword("");
    setUsername("");
  };
  return (
    <div className="w-full mt-14 md:mt-0 md:w-120  rounded-2xl border border-[#34344E] bg-[#1e1e2e] overflow-hidden shadow-lg">
      <Tabs
        defaultValue="signin"
        className="w-full "
        orientation="horizontal"
        selectedKey={activeTab}
        onSelectionChange={(key) => {
          setActiveTab(key);
          clearInput();
        }}
      >
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Authentication"
            className="gap-6 w-full relative rounded-none p-0 border-b border-[#34344E] bg-[#151525]"
          >
            <Tabs.Tab
              id="signin"
              className="w-full py-6 text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-2 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold
            "
            >
              ورود
              <Tabs.Indicator className="bg-white/5 rounded-none shadow-none transition-all duration-200  " />
            </Tabs.Tab>
            <Tabs.Tab
              id="signup"
              className="w-full py-6 text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-2 border-transparent data-[selected=true]:border-[#1111D4] rounded-none  data-[selected=true]:font-bold"
            >
              ثبت نام
              <Tabs.Indicator className="bg-white/5 rounded-none shadow-none transition-all duration-200 " />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="signin" className="p-0 pt-7 ">
          <AuthWrapper
            isLogin
            onSubmit={loginHandler}
            changeTab={(e) => setActiveTab(e)}
          >
            <div className="flex  flex-col gap-5.5">
              <div className="flex flex-col gap-2.5 w-full">
                <Label htmlFor="input-type-identifier">
                  ایمیل یا نام کاربری
                </Label>
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
        </Tabs.Panel>
        <Tabs.Panel id="signup" className="p-0 pt-7 ">
          <AuthWrapper
            onSubmit={registerHandler}
            changeTab={(e) => setActiveTab(e)}
          >
            <div className="flex  flex-col gap-4 md:gap-5.5">
              <div className="flex flex-col gap-2.5 w-full">
                <Label htmlFor="input-type-username">نام کاربری</Label>
                <div className="relative">
                  <User
                    size={20}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
                  />
                  <Input
                    id="input-type-username"
                    placeholder="نام کاربری خود را وارد کنید"
                    type="text"
                    className="bg-[#27273A] border border-[#34344E] h-11.5 md:h-12 rounded-[24px] pr-10 pl-3 w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2.5 w-full">
                <Label htmlFor="input-type-email-reg">ایمیل</Label>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
                  />
                  <Input
                    id="input-type-email-reg"
                    placeholder="jane@example.com"
                    type="email"
                    className="bg-[#27273A] border border-[#34344E] h-11.5 md:h-12 rounded-[24px] pr-10 pl-3 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2.5 w-full">
                <Label htmlFor="input-type-password-reg">رمز عبور</Label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
                  />
                  <Input
                    id="input-type-password-reg"
                    placeholder="••••••••"
                    type={isShowRegisterPass ? "text" : "password"}
                    className="bg-[#27273A] border border-[#34344E] h-11.5 md:h-12 rounded-[24px] pr-10 pl-11 w-full"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value.trim())}
                  />
                  <Button
                    className="absolute top-1/2 -translate-y-1/2 left-1 text-gray-400 "
                    variant="ghost"
                    onClick={() => setIsShowRegisterPass((prev) => !prev)}
                  >
                    {isShowRegisterPass ? <Eye /> : <EyeOff />}
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
                  isRegisterLoading ||
                  !registerPassword.trim() ||
                  !email.trim() ||
                  !username.trim()
                }
              >
                {!isRegisterLoading ? (
                  <>
                    {" "}
                    ثبت نام
                    <UserPlus className="mr-0.5" />
                  </>
                ) : (
                  <Spinner color="current" />
                )}
              </Button>
            </div>
          </AuthWrapper>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default AuthForm;
