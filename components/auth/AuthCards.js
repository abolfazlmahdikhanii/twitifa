"use client";
import React from "react";
import Icon from "../ui/Icon/Icon";


const AuthCards = () => {
  const infos = [
    {
      id: 1,
      title: "پیدا کردن دوستان جدید",
      description: "با افراد هم‌فکر ارتباط برقرار کنید.",
      icon: "simple-user",
      iconBg: "bg-[#3B82F6]/10",
      iconColor: "text-[#60A5FA]",
    },
    {
      id: 2,
      title: "به اشتراک گذاشتن لحظات",
      description: "لحظات ناب زندگی خود را ثبت کنید.",
      icon: "camera",
      iconBg: "bg-[#A855F7]/10",
      iconColor: "text-[#C084FC]",
    },
    {
      id: 3,
      title: "دنبال کردن علایق",
      description: "موضوعات مورد علاقه خود را دنبال کنید.",
      icon: "heart-simple",
      iconBg: "bg-[#EC4899]/10",
      iconColor: "text-[#F472B6]",
    },
  ];

  return (
    <div className="w-full max-w-lg flex flex-col gap-y-3 sm:gap-y-4.5 mt-5 sm:mt-8 z-10">
      {infos.map((info) => (
        <div
          key={info.id}
          className="p-3.5 sm:p-5 relative rounded-xl sm:rounded-2xl border border-[#34344E] bg-[#1e1e2e]/30 overflow-hidden backdrop-blur-sm flex items-center gap-x-3.5 sm:gap-x-5"
        >
          {/* Icon */}
          <div
            className={`${info.iconBg} w-11 h-11 sm:w-14 sm:h-14 shrink-0 grid place-items-center rounded-2xl sm:rounded-3xl`}
          >
            <Icon
              name={info.icon}
              className={`${info.iconColor} w-5 h-5 sm:w-6 sm:h-6`}
            />
          </div>

          {/* Text */}
          <div className="space-y-1 sm:space-y-2 min-w-0">
            <p className="text-sm sm:text-lg font-bold">{info.title}</p>
            <p className="dark:text-neutral-400 text-neutral-500 text-xs sm:text-sm">
              {info.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthCards;