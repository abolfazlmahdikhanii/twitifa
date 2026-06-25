"use client";
import { useAuth } from "@/context/AuthContext";
import userSignupSchema from "@/validators/signup";
import { Button, Input, Label, Spinner } from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import Icon from "../ui/Icon/Icon";
import AuthWrapper from "./AuthWrapper";

const Register = ({ setActiveTab }) => {
  const { refetch, setFetchingHandler, showOtpHandler } = useAuth();

  const [isShowRegisterPass, setIsShowRegisterPass] = useState(false);

  const [registerPassword, setRegisterPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

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
        clearInput();
        showOtpHandler(email);
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
    setEmail("");

    setRegisterPassword("");
    setUsername("");
  };
  const inputClass =
    "bg-[#27273A] border border-[#34344E] h-10 sm:h-11.5 md:h-12.5 rounded-[24px] w-full text-sm sm:text-base";
  return (
    <AuthWrapper onSubmit={registerHandler} changeTab={(e) => setActiveTab(e)}>
      <div className="flex  flex-col gap-4 md:gap-5.5">
        <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
          <Label htmlFor="input-type-username" className="text-xs sm:text-sm">نام کاربری</Label>
          <div className="relative">
            <Icon
              name={"simple-user"}
              size={20}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
            />
            <Input
              id="input-type-username"
              placeholder="نام کاربری خود را وارد کنید"
              type="text"
              className={`${inputClass} pr-10 pl-3 `}
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
          <Label htmlFor="input-type-email-reg" className="text-xs sm:text-sm">ایمیل</Label>
          <div className="relative">
            <Icon
              name="email"
              size={20}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
            />
            <Input
              id="input-type-email-reg"
              placeholder="jane@example.com"
              type="email"
              className={`${inputClass} pr-10 pl-3 `}
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
          <Label htmlFor="input-type-password-reg" className="text-xs sm:text-sm">رمز عبور</Label>
          <div className="relative">
            <Icon
              name="password"
              size={20}
              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
            />
            <Input
              id="input-type-password-reg"
              placeholder="••••••••"
              type={isShowRegisterPass ? "text" : "password"}
              className={`${inputClass} pr-10 pl-11`}
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value.trim())}
            />
            <Button
              className="absolute top-1/2 -translate-y-1/2 left-1 text-gray-400 "
              variant="ghost"
              isIconOnly
              onClick={() => setIsShowRegisterPass((prev) => !prev)}
            >
              {isShowRegisterPass ? (
                <Icon name={"eye"} size={18} className={"size-4"}/>
              ) : (
                <Icon name={"eye-off"} size={18}className={"size-4"} />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-2 md:pt-3 w-full">
        <Button
          type="submit"
          variant="primary"
          className={" py-3.5 w-full h-11.5 md:h-13 font-bold text-sm sm:text-base "}
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
              <Icon
                name="add-user"
                size={20}
                className="mr-0.5 size-4 sm:size-5"
              />
            </>
          ) : (
            <Spinner color="current" />
          )}
        </Button>
      </div>
    </AuthWrapper>
  );
};

export default Register;
