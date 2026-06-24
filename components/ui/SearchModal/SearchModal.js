import { Avatar, ListBox } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import SkeletonProfile from "../SkeletonProfile/SkeletonProfile";

const SearchModal = ({ results = [], isSearching, query, onClose }) => {
  const authorName = useCallback(
    (item) =>
      item.accountType === "legal"
        ? item.organizationName
        : `${item.firstName} ${item.lastName}`,
    [],
  );
  return (
    <div className="min-h-25 flex flex-col w-full overflow-hidden">
      {query.length >= 1 && (
        <Link
          href={`/search?q=${encodeURIComponent(query)}`}
          className={`py-4 px-5 cursor-pointer border-b dark:hover:bg-white/10   hover:bg-slate-200 transition-all duration-200 overflow-hidden ${results.length ? "border-b-[#34344E]" : "border-b-transparent"}`}
        >
          <p>جستجو برای {`"${query}"`}</p>
        </Link>
      )}
      {isSearching && !results.length && <SkeletonProfile length={3} />}
      {!isSearching && query.length >= 2 && results.length > 0 && (
        <ListBox
          className="h-full max-h-75  w-full overflow-y-auto"
          items={results}
        >
          {(user) => (
            <ListBox.Item
              id={user._id}
              textValue={user.name}
              className="w-full py-3 px-3.5 dark:hover:bg-white/10 hover:bg-slate-200"
            >
              <div className="flex items-center cursor-pointer  relative w-full ">
                <Link className="block w-full" href={`#`}>
                  <div className="flex items-center gap-2.5 w-full">
                    <div className="self-start  ">
                      <Avatar className="size-14 relative z-1">
                        <Avatar.Image
                          alt="Blue"
                          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                        />
                        <Avatar.Fallback className="uppercase">
                          {user.username?.charAt(0)}
                        </Avatar.Fallback>
                      </Avatar>
                    </div>
                    <div className="">
                      <div className="flex items-center ">
                        <p className="text-lg font-bold truncate">
                          {authorName(user)}
                        </p>
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
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              {/* <ListBox.ItemIndicator /> */}
            </ListBox.Item>
          )}
        </ListBox>
      )}
      {!isSearching && query.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-7 px-3">
          افراد، لیست‌ها یا کلمات کلیدی را جستجو کنید
        </p>
      )}
    </div>
  );
};

export default SearchModal;
