import { formatTimeCreated } from "@/utils/post";
import { Avatar } from "@heroui/react";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HoverProfile from "../Profile/HoverProfile";

const AuthorInfo = ({
  displayUser,
  displayName,
  username,
  updatedAt,
  selfReply,
}) => {
  return (
    <HoverProfile userInfo={displayUser}>
      <div className="flex items-center cursor-pointer relative min-w-0">
        {/* Avatar */}
        <div
          className={`self-start shrink-0 ml-3 sm:ml-4.5 ${selfReply ? "mr-11" : ""} relative`}
        >
          <Avatar className="size-11 sm:size-14 relative z-1">
            <Avatar.Image
              src={
                displayUser?.avatar ||
                "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
              }
              alt={displayName}
            />
            <Avatar.Fallback className="uppercase">
              {username?.charAt(0)}
            </Avatar.Fallback>
          </Avatar>
          {selfReply && (
            <div className="absolute w-0.5 -top-6 -right-4 bg-[#34344E] h-8">
              <div className="rounded-b-[20px] border-s-2 -bottom-8 absolute border-s-[#34344E] w-22 h-22 right-0"></div>
            </div>
          )}
        </div>

        {/* Name + username + time */}
        <div className="flex items-center min-w-0 flex-1">
          {/* displayName */}
          <Link
            className="flex items-center gap-x-1 min-w-0 shrink"
            href={`/${username}`}
          >
            <span className="text-sm sm:text-lg font-bold truncate max-w-20 sm:max-w-40">
              {displayName}
            </span>
            {!displayUser?.isVerified && (
              <Image
                src="/images/verified-business.png"
                alt="verified"
                width={20}
                height={20}
                className="object-cover size-4 sm:size-5 shrink-0 -mt-1"
              />
            )}
          </Link>

          {/* username */}
          <Link href={`/${username}`} className="shrink min-w-0">
            <span
              className="dark:text-neutral-400 text-neutral-500 mr-1.5 sm:mr-2.25 text-xs sm:text-[16px] truncate max-w-15 sm:max-w-30"
              dir="auto"
            >
              @{username}
            </span>
          </Link>

          {/* dot + time */}
          <span className="shrink-0 dark:text-neutral-400 text-neutral-500 flex items-center">
            <Dot size={14} />
          </span>
          <span className="shrink-0 dark:text-neutral-400 text-neutral-500 text-[11px] sm:text-[15px] mt-1 ">
            {formatTimeCreated(updatedAt)}
          </span>
        </div>
      </div>
    </HoverProfile>
  );
};

export default AuthorInfo;
