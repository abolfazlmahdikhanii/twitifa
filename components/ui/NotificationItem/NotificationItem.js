import { Avatar, AvatarFallback, AvatarImage } from "@heroui/react";
import React from "react";
import NotificationType from "./NotificationType";
import NotificationIcon from "./NotificationIcon";

const NotificationItem = ({ notification }) => {
  if (!notification.actorIds.length) return null;

  return (
    <div className="py-3 sm:py-4 border-b border-[#34344E]">
      <div className="flex gap-3 sm:gap-3.75 px-4 sm:px-7">
        {/* Icon */}
        <div className="mt-1.5 sm:mt-1.75 shrink-0">
          <NotificationIcon type={notification.type} />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2.5 sm:gap-3.25 min-w-0 flex-1">
          {/* Avatars */}
          {notification.type !== "alert" && notification.type !== "admin" && (
            <div className="flex -space-x-2 sm:-space-x-3">
              {notification.actorIds.map((author) => (
                <Avatar key={author._id} className="w-9 h-9 sm:w-12 sm:h-12 shrink-0">
                  <AvatarImage src={author.avatar} alt={author.username} />
                  <AvatarFallback className="font-bold text-xs">
                    {author.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}

          {/* Text */}
          <div className="min-w-0">
            <NotificationType
              type={notification.type}
              actorIds={notification.actorIds}
              message={notification?.message}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;