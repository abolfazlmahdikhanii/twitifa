"use client";
import { useAuth } from "@/context/AuthContext";
import { Avatar, Button, Popover } from "@heroui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import Icon from "../ui/Icon/Icon";
const PostModal = dynamic(() => import("../Posts/PostModal"), { ssr: false });
const PostBox = dynamic(() => import("./PostBox"), { ssr: false });

const RightSidebar = ({ username, name, avatar, notificationCount }) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const { user } = useAuth();

  return (
    <header className="py-2 px-2  pb-7 hidden md:block">
      <div className="flex flex-col justify-between h-full gap-5">
        <div className="flex flex-col gap-y-4.5">
          <div className="flex items-center gap-2.5 py-3.5 ">
            <Icon name="app-logo" className="text-[#6366F1]" size={44} />
            <h1 className="text-[26px] font-bold">تویتیفای</h1>
          </div>
          <div>
            <nav className="flex flex-col gap-y-4.5">
              <Link href={"/feed"} className="menu-item">
                <Icon name="home" size={26} />
                خانه
              </Link>
              <Link href={"/explorer"} className="menu-item">
                <Icon name="search" size={26} />
                کاوش
              </Link>
              <Link href={"/notifications"} className="menu-item">
                <div className="relative">
                  <Icon name="bell" size={26} />

                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -left-1.5 leading-none flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </div>
                اعلان ها
              </Link>
              <Link href={"/twit-tv"} className="menu-item">
                <Icon name="twit-tv" size={26} />
                 تویتیوی
              </Link>
              <Link href={"#"} className="menu-item">
                <Icon name="inbox" size={26} />
                پیام ها
              </Link>
              <Link href={`/${username}`} className="menu-item">
                <Icon name="profile" size={28} />
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
                    alt="profile image"
                    src={
                      avatar ||
                      user?.avatar ||
                      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                    }
                  />
                  <Avatar.Fallback className="uppercase">
                    {username?.charAt(0)}
                  </Avatar.Fallback>
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
                  <Icon name="more-horizontal" />
                </Button>
              </div>
            </div>
          </Popover.Trigger>
          <Popover.Content className="w-68 bg-[#1A1A31]   shadow-none">
            <Popover.Dialog dir="rtl">
              <div className={"user-popup__item mb-2"}>
                <Icon name="user-circle" size={24} />
                ویرایش پروفایل
              </div>

              <div className={"user-popup__item text-red-500"}>
                <Icon name="logout" size={22} />
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
