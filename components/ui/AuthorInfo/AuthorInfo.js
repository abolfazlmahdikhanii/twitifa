import { Avatar } from "@heroui/react";
import HoverProfile from "../Profile/HoverProfile";
import Link from "next/link";
import Image from "next/image";
import { Dot } from "lucide-react";
import { formatTimeCreated } from "@/utils/post";

const AuthorInfo = ({
  displayUser,
  displayName,
  username,
  updatedAt,
  selfReply,
}) => {
  return (
    <HoverProfile userInfo={displayUser}>
      <div className="flex items-center cursor-pointer relative">
        <div
          className={`self-start ml-4.5 ${selfReply ? "mr-11" : " "} relative`}
        >
          <Avatar className="size-14 relative z-1">
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
            <div className="absolute w-0.5 -top-6 -right-4 bg-[#34344E] h-8 ">
              <div className="rounded-b-[20px] border-s-2 -bottom-8 absolute border-s-[#34344E] w-22 h-22 right-0"></div>
            </div>
          )}
        </div>
        <Link className="flex items-center" href={`/${username}`}>
          <span className="text-lg font-bold truncate">{displayName}</span>
          {!displayUser?.isVerified && (
            <Image
              src="/images/verified-business.png"
              alt="verified"
              width={20}
              height={20}
              className="object-cover size-5 shrink-0 mr-1.5 -mt-1.5"
            />
          )}
        </Link>
        <Link href={`/${username}`}>
          <span
            className="dark:text-neutral-400 text-neutral-500 mr-2.25  text-[16px] inline-block"
            dir="auto"
          >
            @{username}
          </span>
        </Link>
        <span className="mx-1 dark:text-neutral-400 text-neutral-500">
          <Dot size={16} />
        </span>
        <span className="dark:text-neutral-400 text-neutral-500  text-[15px]">
          {formatTimeCreated(updatedAt)}
        </span>
      </div>
    </HoverProfile>
  );
};

export default AuthorInfo;
