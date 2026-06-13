"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@heroui/react";
import React from "react";
import GoogleBtn from "./GoogleBtn";

const AuthWrapper = ({ children, isLogin = false, onSubmit, changeTab }) => {
  return (
    <Card variant="transparent" className="p-0 rounded-none">
      <CardHeader className="flex flex-col items-center justify-center gap-y-2.5 mb-5 ">
        <p className="font-bold text-xl md:text-2xl ">خوش آمدید!</p>
        <p className="md:text-sm text-xs text-neutral-500 dark:text-neutral-400">
          لطفا اطلاعات حساب خود را وارد کنید
        </p>
      </CardHeader>
      <CardContent className="md:px-8 px-6">
        <form
          className="w-full  flex flex-col gap-4 md:gap-5.5 "
          onSubmit={onSubmit}
        >
          {children}
        </form>
        <div className="flex items-center gap-x-4 mt-8 md:mt-11 mb-2.5 md:mb-4">
          <div className="h-px w-[40%] bg-[#34344E]"></div>
          <p className="text-[#6B7280] text-sm whitespace-nowrap">
            یا {isLogin ? "ورود" : "ثبت نام"} با
          </p>
          <div className="h-px w-[40%] bg-[#34344E]"></div>
        </div>
        <div className="mt-3 mb-4">
          {/* <GoogleBtn /> */}
          <GoogleBtn isLogin={isLogin} />
        </div>
      </CardContent>
      <CardFooter className="bg-[#151525] p-4 w-full rounded-none">
        <p className="dark:text-neutral-400 text-neutral-500 text-center text-sm w-full">
          {isLogin ? (
            <>
              {" "}
              حساب کاربری ندارید؟{" "}
              <span
                className="text-[#1111D4] cursor-pointer"
                onClick={() => changeTab("signup")}
              >
                ثبت نام کنید
              </span>
            </>
          ) : (
            <>
              قبلاً ثبت نام کرده‌اید؟{" "}
              <span
                className="text-[#1111D4] cursor-pointer"
                onClick={() => changeTab("signin")}
              >
                وارد شوید
              </span>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthWrapper;
