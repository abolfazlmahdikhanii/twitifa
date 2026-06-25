import Link from "next/link";
import HoverProfile from "../Profile/HoverProfile";
import { Avatar } from "@heroui/react";
import Image from "next/image";
import BtnFollow from "../BtnFollow/BtnFollow";

const AuthorPostInfo = ({
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
    <div className="py-2 sm:py-2.5 w-full">
      <div className="flex justify-between w-full items-center gap-x-2">
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
            <Link href="#" className="min-w-0">
              <div className="flex items-center gap-3 sm:gap-4.5 min-w-0">
                {/* Avatar */}
                <div className="shrink-0">
                  <Avatar className="size-11 sm:size-14">
                    <Avatar.Image
                      alt={username}
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
                    <p className="text-sm sm:text-lg font-bold truncate max-w-30 sm:max-w-55">
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
                    className="dark:text-neutral-400 text-neutral-500 text-xs sm:text-[15px] block mt-1 truncate max-w-25 sm:max-w-45"
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
    </div>
  );
};

export default AuthorPostInfo;