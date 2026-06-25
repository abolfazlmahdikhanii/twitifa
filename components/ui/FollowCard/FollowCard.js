import Image from "next/image";
import React from "react";
import HoverProfile from "../Profile/HoverProfile";
import Link from "next/link";
import { Avatar } from "@heroui/react";
import BtnFollow from "../BtnFollow/BtnFollow";

const FollowCard = ({
  username,
  firstName,
  lastName,
  organizationName,
  avatar,
  bio,
  accountType,
}) => {
  const authorName =
    accountType === "legal" ? organizationName : `${firstName} ${lastName}`;

  return (
    <div className="py-2 sm:py-2.5">
      <div className="flex justify-between items-center gap-x-2">
        <HoverProfile
          userInfo={{
            username,
            firstName,
            lastName,
            organizationName,
            avatar,
            bio,
            accountType,
          }}
        >
          <div className="flex items-center cursor-pointer relative min-w-0">
            <Link href={`/${username}`} className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* Avatar */}
                <div className="shrink-0">
                  <Avatar className="size-11 sm:size-14">
                    <Avatar.Image
                      alt={`${username} avatar image`}
                      src={
                        avatar ||
                        "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                      }
                    />
                    <Avatar.Fallback className="uppercase">
                      {username?.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                </div>

                {/* Name + username */}
                <div className="min-w-0">
                  <div className="flex items-center gap-x-1 min-w-0">
                    <p className="text-sm sm:text-lg font-bold truncate max-w-27.5 sm:max-w-50">
                      {authorName}
                    </p>
                    <Image
                      alt="verified-business"
                      width={20}
                      height={20}
                      src="/images/verified-business.png"
                      className="object-cover size-4 sm:size-5 shrink-0 -mt-1"
                      priority
                    />
                  </div>
                  <span
                    className="dark:text-neutral-400 text-neutral-500 text-xs sm:text-[15px] block truncate max-w-25 sm:max-w-45 text-right"
                    dir="auto"
                  >
                    @{username}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </HoverProfile>

        <div className="shrink-0">
          <BtnFollow username={username} />
        </div>
      </div>

      {bio && (
        <p className="text-neutral-200 text-sm sm:text-base leading-[1.8] pr-13 sm:pr-17 line-clamp-2 mt-0.5 sm:mt-0.75">
          {bio}
        </p>
      )}
    </div>
  );
};

export default FollowCard;