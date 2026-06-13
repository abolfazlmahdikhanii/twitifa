import { Avatar, AvatarFallback, AvatarImage } from "@heroui/react";
import React from "react";

const getDisplayName = (author) =>
  author.organizationName ||
  `${author.firstName || ""} ${author.lastName || ""}`.trim() ||
  author.username;
const SharedFollower = ({ sharedFollower = [] }) => {
  if (!sharedFollower?.length) return null;

  const visibleCount = 3;
  const visibleFollowers = sharedFollower.slice(0, visibleCount);
  const hiddenCount = Math.max(0, sharedFollower.length - visibleCount);

  return (
    <div className="flex items-center gap-2">
      {/* Avatars */}
      <div className="flex -space-x-3">
        {!!sharedFollower.length > 0 &&
          visibleFollowers.map((author, index) => (
            <Avatar key={author._id} className="w-8 h-8 ">
              <AvatarImage src={author.avatar} alt={author.username} />
              <AvatarFallback className="font-bold text-xs">
                {author.username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
      </div>

      {/* Text */}
      <p className="text-sm text-muted leading-[1.6]">
        <span className="font-medium">دنبال شده توسط</span>{" "}
        {visibleFollowers.map(getDisplayName).join("، ")}
        {hiddenCount > 0 && <span className=""> و {hiddenCount} نفر دیگر</span>}
      </p>
    </div>
  );
};

export default SharedFollower;
