import Link from "next/link";
import HoverProfile from "../Profile/HoverProfile";
import { Avatar } from "@heroui/react";
import Image from "next/image";
import BtnFollow from "../BtnFollow/BtnFollow";

const AuthorPostInfo = ({  username,
  firstName,
  lastName,
  organizationName,
  avatar,
  bio,
  accountType,}) => {
  const authorName =
    accountType === "legal" ? organizationName : `${firstName} ${lastName}`;
  return (
    <div className=" py-2.5 w-full ">
      <div className="flex  justify-between w-full items-center ">
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
            <Link className="" href={`#`}>
              <div className="flex items-center gap-4.5">
                <div className="self-start  ">
                  <Avatar className="size-14 relative z-1">
                    <Avatar.Image
                      alt="Blue"
                      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
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
                    className="dark:text-neutral-400 text-neutral-500   text-[15px] inline-block mt-1.25"
                    dir="auto"
                  >
                    @{username}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </HoverProfile>
        <BtnFollow username={username} />
      </div>
 
    </div>
  );
};

export default AuthorPostInfo;
