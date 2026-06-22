import React, { useCallback } from "react";
import Icon from "../Icon/Icon";

const NotificationIcon = ({ type }) => {
  const getNotificationIcon = useCallback((type) => {
    switch (type) {
      case "follow":
        return <Icon name="user" className="w-[30px] h-[30px] text-blue-500" />;
        break;
      case "like":
        return <Icon name="heart-fill" className="w-7 h-7 text-red-500" />;
        break;
      case "reply":
        return <Icon name="reply" className="w-[26px] h-[26px] text-yellow-500" />;
      case "retweet":
        return <Icon name="repost" className={`w-[26px] h-[26px] text-[#00ba7b]`} />;
      case "mention":
        return <Icon name="at-sign" className="w-[26px] h-[26px] text-indigo-500" />;
      case "quote":
        return <Icon name="quote-marks" className="w-[26px] h-[26px] text-purple-600" />;
      case "admin":
        return <Icon name="repost" className={`w-[26px] h-[26px] text-[#00ba7b]`} />;
      case "alert":
        return <Icon name="alert-triangle" className="w-[26px] h-[26px] text-red-500 mt-1" />;
    }
  }, []);
  return <>{getNotificationIcon(type)}</>;
};

export default NotificationIcon;
