"use client";
import { Card, CardContent, CardFooter, CardHeader } from "@heroui/react";
import React from "react";
import GoogleBtn from "./GoogleBtn";

const AuthWrapper = ({ children, isLogin = false, onSubmit, changeTab }) => {
  return (
    <Card variant="transparent" className="p-0 rounded-none">
      <CardHeader className="flex flex-col items-center justify-center gap-y-2 sm:gap-y-2.5 mb-3 sm:mb-5">
        <p className="font-bold text-lg sm:text-xl md:text-2xl">خوش آمدید!</p>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          لطفا اطلاعات حساب خود را وارد کنید
        </p>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 md:px-8">
        <form
          className="w-full flex flex-col gap-3 sm:gap-4 md:gap-5.5"
          onSubmit={onSubmit}
        >
          {children}
        </form>

        {/* divider */}
        <div className="flex items-center gap-x-3 sm:gap-x-4 mt-5 sm:mt-8 md:mt-11 mb-2 sm:mb-2.5 md:mb-4">
          <div className="h-px flex-1 bg-[#34344E]" />
          <p className="text-[#6B7280] text-xs sm:text-sm whitespace-nowrap">
            یا {isLogin ? "ورود" : "ثبت نام"} با
          </p>
          <div className="h-px flex-1 bg-[#34344E]" />
        </div>

        <div className="mt-2.5 sm:mt-3 mb-3 sm:mb-4">
          <GoogleBtn isLogin={isLogin} />
        </div>
      </CardContent>

      <CardFooter className="bg-[#151525] p-3 sm:p-4 w-full rounded-none">
        <p className="dark:text-neutral-400 text-neutral-500 text-center text-xs sm:text-sm w-full">
          {isLogin ? (
            <>
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