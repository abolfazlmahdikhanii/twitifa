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
    <div className=" py-2.5 ">
      <div className="flex  justify-between">
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
          <div className="flex items-center cursor-pointer  relative">
            <Link className="" href={`/${username}`}>
              <div className="flex items-center gap-2.5">
                <div className="self-start  ">
                  <Avatar className="size-14 relative z-1">
                    <Avatar.Image
                      alt={`${username} avatar image`}
                      src={avatar||"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
                    />
                    <Avatar.Fallback className="uppercase">
                      {username?.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                </div>
                <div className="">
                  <div className="flex items-center ">
                    <p className="text-lg font-bold truncate">{authorName}</p>
                    <Image
                      alt="verified-business"
                      width={96}
                      height={96}
                      src={"/images/verified-business.png"}
                      className="object-cover size-5 shrink-0 mr-1.25 -mt-1.5"
                      priority
                    />
                  </div>
                  <span
                    className="dark:text-neutral-400 text-neutral-500   text-[15px] inline-block"
                    dir="auto"
                  >
                    @{username}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </HoverProfile>
        <BtnFollow username={username}  />
      </div>
      {bio && (
        <p className="text-neutral-200  leading-[1.8] pr-17 line-clamp-2 mt-0.75">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
          perferendis
        </p>
      )}
    </div>
  );
};

export default FollowCard;
