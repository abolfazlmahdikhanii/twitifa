"use client";
import { Avatar, Button } from "@heroui/react";
import {
  Calendar,
  Ellipsis,
  Flag,
  LampCeiling,
  Link2,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import BtnFollow from "../ui/BtnFollow/BtnFollow";
import SharedFollower from "../ui/SharedFollower/SharedFollower";

const ProfileHeader = ({
  username,
  firstName,
  lastName,
  email,
  followerCount,
  followingCount,
  isMe,
  organizationName,
  isFollow,
  sharedFollowers = [],
}) => {
  const { push } = useRouter();
  return (
    <div>
      {/* avatar */}
      <div className="relative">
        <div className="h-50">
          <Image
            src={"/images/profile-bg.webp"}
            alt="profile-bg"
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="relative ">
        <div className="absolute -top-5 -translate-y-1/2 right-5.5 flex flex-row-reverse items-center ">
          <Avatar className="w-20 h-20 ">
            <Avatar.Image
              alt="Blue"
              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
            />
            <Avatar.Fallback className="text-2xl capitalize">
              {username?.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
        </div>
        <div className="flex items-center justify-end mt-6 px-5 gap-x-3">
          {isMe ? (
            <Button
              variant="outline"
              className={"h-11.5 px-8 border-1.5 border-[#34344E]"}
              onPress={() => push("/settings/profile")}
            >
              ویرایش نمایه
            </Button>
          ) : (
            <BtnFollow username={username} isFollow={isFollow} isUserPage />
          )}
          <Button
            variant="outline"
            isIconOnly
            className={"h-11.5 w-11.5 border-1.5 border-[#34344E]"}
          >
            <Ellipsis />
          </Button>
        </div>
      </div>
      {/* username */}
      <div className="mx-6 -mt-1.5 space-y-1.25">
        <h1 className="text-[28px] font-bold">
          {firstName && lastName
            ? `${firstName} ${lastName}`
            : organizationName}
        </h1>
        <p
          dir="auto"
          className="text-right dark:text-neutral-400 text-neutral-500 text-[17px] en"
        >
          @{username}
        </p>
      </div>
      {/* extra info */}
      <div className="mt-4 mx-6">
        <div className="mb-6.5 whitespace-pre-wrap">
          <span
            dir="auto"
            className="block min-h-3.5 text-[17px] text-[rgb(225,226,226)] leading-loose max-w-3xl font-light"
          >
            برنامه تلویزیونی بدون توقف شبکه ۳ سیما | بررسی چالشی شبهات روز جامعه
            | از شنبه تا چهارشنبه | حوالی ساعت ۱۸ | لایک و بازنشر به معنای تایید
            نیست، صرفا تشکر است
          </span>
        </div>
        {/* general info */}
        <div className="flex items-center gap-x-7.5 gap-y-3.5 flex-wrap max-w-2xl">
          <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
            <MapPin size={18} />
            <span className="text-[17px] leading-7">تهران</span>
          </div>
          <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
            <Link2 size={18} className="-rotate-45" />
            <Link
              href="https://virasty.com/"
              className="text-[17px] leading-7 text-blue-500"
              target="_blank"
            >
              http://www.a.com
            </Link>
          </div>
          <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
            <Calendar size={16} />
            <span className="text-[17px] leading-7">
              تاریخ پیوستن: مرداد 1402
            </span>
          </div>
          <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
            <LampCeiling size={18} />
            <span className="text-[17px] leading-7"> متولد: 25 مرداد</span>
          </div>
          <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
            <Flag size={16} />
            <span className="text-[17px] leading-7">IRI</span>
          </div>
        </div>
        {/* follower info */}
        <div className="mt-9 flex items-center gap-x-8.5 pr-2">
          <p className="font-semibold text-[17px] ">
            {followingCount ?? 0}{" "}
            <span className="dark:text-neutral-400 text-neutral-500 mr-px">
              دنبال شده{" "}
            </span>
          </p>
          <p className="font-semibold text-[17px]">
            {followerCount ?? 0}{" "}
            <span className="dark:text-neutral-400 text-neutral-500 mr-px">
              دنبال کننده{" "}
            </span>
          </p>
        </div>
        {/* sharedFollower */}

        {!isMe && (
          <div className="mt-5.5 pb-1.75">
            {sharedFollowers?.length > 0 ? (
              <SharedFollower sharedFollower={sharedFollowers} />
            ) : (
              <p className="font-medium text-sm text-muted leading-[1.6] pr-3">
                دنبال کننده مشترکی بین شما و این حساب وجود ندارد
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
