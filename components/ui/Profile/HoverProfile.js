"use client";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Avatar, Button } from "@heroui/react";
import Image from "next/image";
import React from "react";
import { Dot } from "lucide-react";
import { formatTimeCreated, getAuthorName } from "@/utils/post";
import BtnFollow from "../BtnFollow/BtnFollow";
import useFollow from "@/hooks/useFollow";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import SharedFollower from "../SharedFollower/SharedFollower";

const HoverProfile = ({ userInfo, children }) => {
  const { user } = useAuth();
  const { followCount, refetchFollowCount, sharedFollower, follow } = useFollow(
    userInfo?.username,
    {
      fetchFollow: true,
      fetchFollowing: false,
      fetchFollower: false,
      fetchFollowCount: true,
      fetchSharedFollower: true,
    },
  );

  return (
    <HoverCard.Root
      openDelay={550}
      closeDelay={400}
      onOpenChange={(open) => open && refetchFollowCount()}
    >
      <HoverCard.Trigger asChild>{children}</HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align="start"
          sideOffset={5}
          className="w-85 bg-[#1A1A31] rounded-[24px] py-6.5 px-4.5 z-50 "
        >
          {/* Header */}
          <div className="flex items-center gap-x-2 w-full justify-between">
            <Avatar className="size-14">
              <Avatar.Image
                alt={`${userInfo?.username} avatar image`}
                src={userInfo?.avatar||"https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
              />
              <Avatar.Fallback className="uppercase">
                {userInfo?.username?.charAt(0)}
              </Avatar.Fallback>
            </Avatar>
            <BtnFollow username={userInfo?.username} />
          </div>

          {/* Name & Username */}
          <div className="mt-4 px-2.5">
            <div className="flex items-center">
              <Link href={`/${userInfo?.username}`}>
                <p className="text-lg font-bold">{getAuthorName(userInfo)}</p>
              </Link>
              <Image
                alt="verified-business"
                width={96}
                height={96}
                src={"/images/verified-business.png"}
                className="object-cover size-5 shrink-0 mr-1.75 -mt-1.5"
              />
            </div>
            <div className="flex items-center gap-x-2.75 mt-1">
              <Link href={`/${userInfo?.username}`}>
                <p
                  className="text-base dark:text-neutral-400 text-neutral-500 truncate  text-right"
                  dir="auto"
                >
                  @{userInfo?.username}
                </p>
              </Link>
              {follow && follow.isFollowMe && (
                <p className="px-2 py-0.5 text-sm text-muted bg-body rounded-lg">
                  شما را دنبال می کند
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {userInfo?.bio && (
            <p className="mt-3 text-base text-neutral-300 px-2 line-clamp-2 leading-[1.8]">
              {userInfo?.bio}
            </p>
          )}

          {/* Stats */}
          <div className="mt-7 flex items-center justify-between px-3 ">
            <div>
              <span className="font-semibold">
                {followCount?.followingCount ?? 0}
              </span>
              <span className="mr-1 text-[15px] text-muted font-semibold">
                دنبال شده
              </span>
            </div>
            <div>
              <span className="font-semibold">
                {followCount?.followerCount ?? 0}
              </span>
              <span className="mr-1 text-[15px] text-muted font-semibold">
                دنبال کننده
              </span>
            </div>
          </div>

          {/* shared follower */}
          {user&&user.username !== userInfo.username && (
            <div className="mt-5 pb-1.5">
              {sharedFollower && sharedFollower.sharedFollower?.length > 0 ? (
                <SharedFollower
                  sharedFollower={
                    sharedFollower && sharedFollower?.sharedFollower
                  }
                />
              ) : (
                <p className="font-medium text-sm text-muted leading-[1.6] pr-3">
                  دنبال کننده مشترکی بین شما و این حساب وجود ندارد
                </p>
              )}
            </div>
          )}
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default HoverProfile;
