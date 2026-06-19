"use client";
import { useAuth } from "@/context/AuthContext";
import AuthCards from "./AuthCards";
import AuthForm from "./AuthForm";
import AuthOtp from "./AuthOtp";

const AuthPage = () => {
  const { isShowOtp } = useAuth();
  return (
    <>
      <div>
        {!isShowOtp ? (
          <>
            <div>
              <h2 className="text-4xl lg:text-5xl font-black leading-[1.4] tracking-tight mb-3">
                دنیای خود را <br />
                <span className="inline-block bg-clip-text text-transparent bg-linear-to-l from-blue-400 to-indigo-500  ">
                  گسترش دهید
                </span>
              </h2>
              <p className="text-lg dark:text-neutral-400 text-neutral-500 max-w-md leading-loose">
                به جمع هزاران کاربر بپیوندید. اینجا مکانی برای دیده شدن، شنیده
                شدن و ارتباط با دوستان واقعی است.
              </p>
            </div>

            <AuthCards />
          </>
        ) : null}
      </div>
      {!isShowOtp ? (
        <>
          <div className="py-6 md:py-0">
            <AuthForm />
          </div>
        </>
      ) : (
        <AuthOtp />
      )}
    </>
  );
};

export default AuthPage;
