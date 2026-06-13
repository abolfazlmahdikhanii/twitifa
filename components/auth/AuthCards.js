"use client";
import React from "react";
import { DynamicIcon } from "lucide-react/dynamic";

const AuthCards = () => {
  const infos = [
    {
      id: 1,
      title: "پیدا کردن دوستان جدید",
      description: "با افراد هم‌فکر ارتباط برقرار کنید.",
      icon: "users",
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
      icon: "heart",
      iconBg: "bg-[#EC4899]/10",
      iconColor: "text-[#F472B6]",
    },
  ];
  return (
    <div className="max-w-lg flex flex-col gap-y-4.5 mt-8 z-10">
      {infos.map((info) => (
        <div
          key={info.id}
          className=" p-5 relative rounded-2xl border border-[#34344E] bg-[#1e1e2e]/30 overflow-hidden backdrop-blur-sm flex items-center gap-x-5"
        >
          <div
            className={`${info.iconBg} w-14 h-14 px-3.5 py-2.5 grid place-items-center rounded-3xl`}
          >
            <DynamicIcon
              name={info.icon}
              className={`${info.iconColor} w-6 h-6`}
            />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold ">{info.title}</p>
            <p className="dark:text-neutral-400 text-neutral-500 text-sm">
              {info.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthCards;
