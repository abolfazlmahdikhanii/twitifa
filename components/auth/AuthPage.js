import React from "react";
import AuthCards from "./AuthCards";
import AuthForm from "./AuthForm";

const AuthPage = () => {
  return (
    <div className="flex items-center justify-center h-screen  gap-x-20 px-4 lg:px-0">
      <div className="relative z-10 hidden md:block">
        {/* circle */}
        <div className="bg-[rgba(17,17,212,.2)] w-64 h-64 rounded-full blur-3xl absolute top-4.5 right-12.5"></div>
        <div className="bg-[rgba(147,51,234,.2)] w-64 h-64 rounded-full blur-3xl absolute -bottom-20 left-4"></div>
        {/* title */}
        <div>
          <h2 className="text-4xl lg:text-5xl font-black leading-[1.4] tracking-tight mb-3">
            دنیای خود را <br />
            <span className="inline-block bg-clip-text text-transparent bg-linear-to-l from-blue-400 to-indigo-500  ">
              گسترش دهید
            </span>
          </h2>
          <p className="text-lg dark:text-neutral-400 text-neutral-500 max-w-md leading-loose">
            به جمع هزاران کاربر بپیوندید. اینجا مکانی برای دیده شدن، شنیده شدن و
            ارتباط با دوستان واقعی است.
          </p>
        </div>

        <AuthCards />
      </div>
      <div className="py-6 md:py-0">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
