"use client";
import { useAuth } from "@/context/AuthContext";
import AuthCards from "./AuthCards";
import AuthForm from "./AuthForm";
import AuthOtp from "./AuthOtp";

const AuthPage = () => {
  const { isShowOtp } = useAuth();

  return (
    <>
      {!isShowOtp ? (
        <>
          {/* Hero text + cards */}
          <div className="text-center md:text-right hidden lg:block">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.4] tracking-tight mb-2 sm:mb-3">
              دنیای خود را <br />
              <span className="inline-block bg-clip-text text-transparent bg-linear-to-l from-blue-400 to-indigo-500">
                گسترش دهید
              </span>
            </h2>
            <p className="text-sm sm:text-lg dark:text-neutral-400 text-neutral-500 max-w-md leading-loose mx-auto md:mx-0">
              به جمع هزاران کاربر بپیوندید. اینجا مکانی برای دیده شدن، شنیده شدن
              و ارتباط با دوستان واقعی است.
            </p>
            <AuthCards />
          </div>

          {/* Auth form */}
          <div className="py-4 sm:py-6 md:py-0 w-[90%] lg:w-[unset]">
            <AuthForm />
          </div>
        </>
      ) : (
        <div className="w-full flex justify-center px-4 sm:px-0">
          <AuthOtp />
        </div>
      )}
    </>
  );
};

export default AuthPage;
