import { Avatar, AvatarFallback, AvatarImage } from "@heroui/react";
import React from "react";
import NotificationType from "./NotificationType";
import NotificationIcon from "./NotificationIcon";

const NotificationItem = ({ notification }) => {
  if(!notification.actorIds.length) return
  return (
    <div className="py-4 border-b border-[#34344E]">
      <div className="flex  gap-3.75  px-7">
        <div className="mt-1.75">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex flex-col  gap-3.25">
          {/* Avatars */}
          {(notification.type !== "alert" || notification.type !== "admin") && (
            <div className="flex -space-x-3">
              {!!notification.actorIds.length > 0 &&
                notification.actorIds.map((author, index) => (
                  <Avatar key={author._id} className="w-12 h-12 ">
                    <AvatarImage src={author.avatar} alt={author.username} />
                    <AvatarFallback className="font-bold text-xs">
                      {author.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
            </div>
          )}

          {/* Text */}
          <NotificationType
            type={notification.type}
            actorIds={notification.actorIds}
            message={notification?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
