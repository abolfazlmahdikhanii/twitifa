"use client";
import { useAuth } from "@/context/AuthContext";
import { Button, Tooltip } from "@heroui/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import Icon from "../ui/Icon/Icon";
const PostModal = dynamic(() => import("../Posts/PostModal"), { ssr: false });
const PostBox = dynamic(() => import("./PostBox"), { ssr: false });

const MobileNavBar = ({ username, name, avatar, notificationCount }) => {
  const { user } = useAuth();
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <div className="block md:hidden">
      <header className=" px-2  py-3  fixed bottom-0 left-0 right-0 bg-[#141428]/60 backdrop-blur-sm border-t rounded-t-xl z-20">
        <div>
          <nav className="flex flex-row justify-around items-center">
            <Tooltip delay={0}>
              <Tooltip.Trigger>
                <Link
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 hover:bg-white/10 active:bg-white/20"
                  href={"/feed"}
                >
                  <Icon name="home" size={25} />
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>خانه</p>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip delay={0}>
              <Tooltip.Trigger>
                <Link
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 hover:bg-white/10 active:bg-white/20"
                  href={"/explorer"}
                >
                  <Icon name="search" size={25} />
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>کاوش</p>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip delay={0}>
              <Tooltip.Trigger>
                <Link
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 hover:bg-white/10 active:bg-white/20"
                  href={"/notifications"}
                >
                  <div className="relative">
                    <Icon name="bell" size={25} />

                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -left-1.5 leading-none flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
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
                <Link
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 hover:bg-white/10 active:bg-white/20"
                  href={"/twit-tv"}
                >
                  <Icon name="twit-tv" size={25} />
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>توییتوی</p>
              </Tooltip.Content>
            </Tooltip>
            <Tooltip delay={0}>
              <Tooltip.Trigger>
                <Link
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-200 hover:bg-white/10 active:bg-white/20"
                  href={"#"}
                >
                  <Icon name="inbox" size={25} />
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>پیام ها</p>
              </Tooltip.Content>
            </Tooltip>
          </nav>
        </div>
      </header>
      <div className="fixed bottom-24 right-6 z-20">
        <Button
          variant="primary"
           isIconOnly
          className={"h-13 w-13 text-lg font-bold rounded-full shadow-lg shadow-blue-500/20 [&>svg]:size-5"}
          onPress={() => setIsShowModal(true)}
        >
          <Icon name="edit" size={24} />
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
  );
};

export default MobileNavBar;
