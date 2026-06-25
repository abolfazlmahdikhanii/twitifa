"use client";
import { formatDate } from "@/utils/date";
import { Avatar, Button } from "@heroui/react";
import countryFlagEmoji from "country-flag-emoji";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BtnFollow from "../ui/BtnFollow/BtnFollow";
import Icon from "../ui/Icon/Icon";
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
  bio,
  nationality,
  birthDate,
  createdAt,
  address,
  location,
  website,
  isFollow,
  sharedFollowers = [],
  avatar,
  profileBg,
  occupation,
}) => {
  const { push } = useRouter();
  return (
    <div>
      {/* avatar */}
      <div className="relative">
        <div className="h-50">
          <Image
            src={profileBg || "/images/profile-bg.webp"}
            alt="profile-bg"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="relative ">
        <div className="absolute -top-5 -translate-y-1/2 right-5.5 flex flex-row-reverse items-center ">
          <Avatar className="w-20 h-20 ">
            <Avatar.Image
              alt={`${username} avatar`}
              src={
                avatar ||
                "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
              }
            />
            <Avatar.Fallback className="text-2xl capitalize">
              {username?.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
        </div>
        <div className="flex items-center justify-end mt-6 px-5 gap-x-3">
          {isMe ? (
            <>
              <Button
                variant="outline"
                className={
                  "h-11.5 px-8 border-1.5 border-[#34344E] hidden sm:block"
                }
                onPress={() => push("/settings/profile")}
              >
                ویرایش نمایه
              </Button>
              <Button
                variant="outline"
                isIconOnly
                className={
                  "h-11.5 w-11.5 border-1.5 border-[#34344E] sm:hidden"
                }
                onPress={() => push("/settings/profile")}
              >
                <Icon name={"edit"} size={24} />
              </Button>
            </>
          ) : (
            <BtnFollow username={username} isFollow={isFollow} isUserPage />
          )}
          <Button
            variant="outline"
            isIconOnly
            className={"h-11.5 w-11.5 border-1.5 border-[#34344E]"}
          >
            <Icon name="more-horizontal" />
          </Button>
        </div>
      </div>
      {/* username */}
      <div className="mx-6 -mt-1.5 space-y-1.25">
        <h1 className="sm:text-[28px] text-xl font-bold">
          {firstName && lastName
            ? `${firstName} ${lastName}`
            : organizationName}
        </h1>
        <p
          dir="auto"
          className="text-right dark:text-neutral-400 text-neutral-500 sm:text-[17px] text-sm en"
        >
          @{username}
        </p>
      </div>
      {/* extra info */}
      <div className="mt-4 mx-4.75 sm:mx-6">
        {!bio && (
          <div className="mb-7.5 whitespace-pre-wrap">
            <span
              dir="auto"
              className="block min-h-3.5 text-sm sm:text-[17px] text-[rgb(225,226,226)] leading-loose max-w-3xl font-light"
            >
              برنامه تلویزیونی بدون توقف شبکه ۳ سیما | بررسی چالشی شبهات روز
              جامعه | از شنبه تا چهارشنبه | حوالی ساعت ۱۸ | لایک و بازنشر به
              معنای تایید نیست، صرفا تشکر است
            </span>
          </div>
        )}
        {/* general info */}
        <div className="flex items-center gap-x-4 sm:gap-x-5 md:gap-x-7.5 gap-y-4 sm:gap-y-4.5 flex-wrap max-w-2xl">
          {location && (
            <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
              <Icon
                name="location-pin"
                className={"w-4 h-4 sm:w-4.75 sm:h-4.75"}
              />

              <span className="text-sm sm:text-[17px] leading-7">
                {location}
              </span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
              <Icon
                name="url-link"
                className="-rotate-45 w-4 h-4 sm:w-4.75 sm:h-4.75"
              />

              <Link
                href={website}
                className="sm:text-[17px] text-sm leading-7 text-blue-500"
                target="_blank"
              >
                {website}
              </Link>
            </div>
          )}
          <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
            <Icon name="calendar" className={"w-4 h-4 sm:w-4.75 sm:h-4.75"} />

            <span className="sm:text-[16px] text-sm leading-3">
              تاریخ پیوستن: {createdAt && formatDate(createdAt)}
            </span>
          </div>
          {birthDate && (
            <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
              <Icon
                name="birthday-cake"
                className={"w-4 h-4 sm:w-4.75 sm:h-4.75"}
              />

              <span className="sm:text-[16px] text-sm leading-3">
                {" "}
                متولد: {formatDate(birthDate)}
              </span>
            </div>
          )}
          {occupation && (
            <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
              <Icon
                name="briefcase"
                className={"w-4 h-4 sm:w-4.75 sm:h-4.75"}
              />

              <span className="sm:text-[16px] text-sm leading-6">
                {occupation}
              </span>
            </div>
          )}

          {nationality && (
            <div className="flex items-center gap-x-1.5 dark:text-neutral-400 text-neutral-500">
              <Icon
                name="flag-pole"
                className={"w-4 h-4 sm:w-4.75 sm:h-4.75"}
              />

              <span className="sm:text-[16px] text-sm leading-6">
                {nationality}{" "}
                <span className="text-sm ">
                  {countryFlagEmoji.get(nationality)?.emoji}
                </span>
              </span>
            </div>
          )}
        </div>
        {/* follower info */}
        <div className="mt-11 flex items-center gap-x-8.5 pr-2">
          <p className="font-semibold text-sm sm:text-[17px] ">
            {followingCount ?? 0}{" "}
            <span className="dark:text-neutral-400 text-neutral-500 mr-px">
              دنبال شده{" "}
            </span>
          </p>
          <p className="font-semibold text-sm sm:text-[17px]">
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
              <p className="font-medium text-xs sm:text-sm text-muted leading-[1.6] pr-3">
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
