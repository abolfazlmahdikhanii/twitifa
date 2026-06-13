"use client";
import { useAuth } from "@/context/AuthContext";
import { Avatar, Button, Popover, Separator, Chip } from "@heroui/react";
import {
  Bell,
  Ellipsis,
  Home,
  LogOut,
  Mail,
  Search,
  User,
  UserPen,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import dynamic from "next/dynamic";
const PostModal = dynamic(() => import("../Posts/PostModal"), { ssr: false });
const PostBox = dynamic(() => import("./PostBox"), { ssr: false });

const RightSidebar = ({ username, name, avatar, notificationCount }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const { user } = useAuth();

  return (
    <header className="py-2 px-2  pb-7">
      <div className="flex flex-col justify-between h-full gap-5">
        <div className="flex flex-col gap-y-4.5">
          <div className="flex items-center gap-2.5 py-3.5 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="44"
              viewBox="0 -960 960 960"
              width="44"
              fill="currentColor"
              className="text-[#6366F1]"
            >
              <path d="m334-80-74-30 58-141q-106-28-172-114T80-560v-160q0-66 47-113t113-47q22 0 42 7.5t40 15.5l238 97-160 60v60l440 280 40 200h-80l-40-80H560v160h-80v-160h-80L334-80Zm66-240h353l-63-40H400q-66 0-113-47t-47-113h80q0 33 23.5 56.5T400-440h165L320-596v-124q0-33-23.5-56.5T240-800q-33 0-56.5 23.5T160-720v160q0 100 70 170t170 70ZM240-680q-17 0-28.5-11.5T200-720q0-17 11.5-28.5T240-760q17 0 28.5 11.5T280-720q0 17-11.5 28.5T240-680Zm160 320Z" />
            </svg>
            <h1 className="text-[26px] font-bold">تویتیفای</h1>
          </div>
          <div>
            <nav className="flex flex-col gap-y-4.5">
              <Link href={"/feed"} className="menu-item">
                <Home size={26} />
                خانه
              </Link>
              <Link href={"#"} className="menu-item">
                <Search size={26} />
                کاوش
              </Link>
              <Link href={"/notifications"} className="menu-item">
                <div className="relative">
                  <Bell size={26} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -left-1.5 leading-none flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </div>
                اعلان ها
              </Link>
              <Link href={"#"} className="menu-item">
                <Mail size={26} />
                پیام ها
              </Link>
              <Link href={`/${username}`} className="menu-item">
                <User size={26} />
                پروفایل
              </Link>
            </nav>
          </div>
          <div className="my-12">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className={"h-13 py-3 text-lg font-bold"}
              onPress={() => setIsShowModal(true)}
            >
              پست جدید
            </Button>
            {user && isShowModal && (
              <PostModal isOpen={isShowModal} setIsOpen={setIsShowModal}>
                <PostBox
                  isModal
                  onClose={() => setIsShowModal(false)}
                  author={user}
                />
              </PostModal>
            )}
          </div>
        </div>
        <Popover>
          <Popover.Trigger>
            <div className="flex items-center  menu-item select-none gap-x-0.5 ">
              <div>
                <Avatar>
                  <Avatar.Image
                    alt="Blue"
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                  />
                  <Avatar.Fallback>B</Avatar.Fallback>
                </Avatar>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="font-bold mb-1 text-base truncate">
                    {user?.firstName || user?.lastName
                      ? `${user?.firstName} ${user?.lastName}`
                      : user?.organizationName || name}
                  </p>
                  <p className="text-sm dark:text-neutral-400 text-neutral-500 truncate">
                    {user?.username || username}
                  </p>
                </div>
                <Button variant="ghost" isIconOnly>
                  <Ellipsis />
                </Button>
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Content className="w-68 bg-[#1A1A31]   shadow-none">
            <Popover.Dialog>
              <div className={"user-popup__item mb-2"}>
                <UserPen size={22} />
                ویرایش پروفایل
              </div>

              <div className={"user-popup__item text-red-500"}>
                <LogOut size={22} />
                خروج از حساب کاربری
              </div>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>
    </header>
  );
};

export default RightSidebar;
