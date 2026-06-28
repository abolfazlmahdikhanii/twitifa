"use client";
import { useAuth } from "@/context/AuthContext";
import { Avatar, Button, Popover, Tooltip } from "@heroui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import Dialog from "../ui/Dialog/Dialog";
import Icon from "../ui/Icon/Icon";
const PostModal = dynamic(() => import("../Posts/PostModal"), { ssr: false });
const PostBox = dynamic(() => import("./PostBox"), { ssr: false });

const MobileNavBar = ({ username, name, avatar, notificationCount }) => {
  const { user, logoutHandler } = useAuth();
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowLogoutModal, setIsShowLogoutModal] = useState(false);
  const [isClickProfile, setIsClickProfile] = useState(false);

  const handleClick = () => {
    setIsClickProfile(true);
    setTimeout(() => setIsClickProfile(false), 600);
  };

  const navLinkClass =
    "flex items-center justify-center w-11 h-11 rounded-full transition-colors duration-200 hover:bg-white/10 active:bg-white/20";

  return (
    <div className="block md:hidden">
      {/* Bottom nav */}
      <header className="px-1 py-2 mt-5 fixed bottom-0 left-0 right-0 bg-[#141428]/60 backdrop-blur-sm border-t border-t-[#34344E] rounded-t-xl z-20">
        <nav className="flex flex-row justify-around items-center">
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Link className={navLinkClass} href="/feed">
                <Icon name="home" size={22} />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>خانه</p>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Link className={navLinkClass} href="/explorer">
                <Icon name="search" size={22} />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>کاوش</p>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Link className={navLinkClass} href="/notifications">
                <div className="relative">
                  <Icon name="bell" size={22} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 leading-none flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </div>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>اعلان ها</p>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Link className={navLinkClass} href="/twit-tv">
                <Icon name="twit-tv" size={22} />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>توییتوی</p>
            </Tooltip.Content>
          </Tooltip>

          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Link className={navLinkClass} href="#">
                <Icon name="inbox" size={22} />
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>پیام ها</p>
            </Tooltip.Content>
          </Tooltip>

          {/* Profile popover */}
          <Popover
            key={isShowLogoutModal || isClickProfile ? "active" : "normal"}
          >
            <Popover.Trigger>
              <div className="flex items-center select-none p-1 rounded-full transition-colors duration-200 hover:bg-white/10 active:bg-white/20">
                <Avatar size="sm" className="w-8 h-8">
                  <Avatar.Image
                    alt="profile image"
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
            </Popover.Trigger>
            <Popover.Content className="w-62 bg-[#1A1A31] shadow-none">
              <Popover.Dialog dir="rtl">
                <Link
                  href={`/${username || "/feed"}`}
                  className="user-popup__item mb-2 text-sm"
                  onClick={handleClick}
                >
                  <Icon name="user-circle" size={18} className="shrink-0" />
                  ویرایش پروفایل
                </Link>
                <div
                  className="user-popup__item text-red-500 text-sm"
                  onClick={() => setIsShowLogoutModal(true)}
                >
                  <Icon name="logout" size={17} className="shrink-0" />
                  خروج از حساب کاربری
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
        </nav>
      </header>

      {/* FAB */}
      <div className="fixed bottom-22 right-4 z-20">
        <Button
          variant="primary"
          isIconOnly
          className="h-14.5 w-14.5 text-lg font-bold rounded-full shadow-lg shadow-blue-500/20 [&>svg]:size-5"
          onPress={() => setIsShowModal(true)}
        >
          <Icon name="edit" size={22} />
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

      {isShowLogoutModal && (
        <Dialog
          isOpen={isShowLogoutModal}
          setIsOpen={setIsShowLogoutModal}
          title="خروج از حساب"
          dis="آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟"
          onSubmit={logoutHandler}
          btnText="خروج"
        />
      )}
    </div>
  );
};

export default MobileNavBar;
