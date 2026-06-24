import React, { useCallback } from "react";
import Icon from "../Icon/Icon";

const NotificationIcon = ({ type }) => {
  const getNotificationIcon = useCallback((type) => {
    switch (type) {
      case "follow":
        return <Icon name="user" className="sm:w-7.5 sm:h-7.5 w-6 h-6 text-blue-500" />;
        break;
      case "like":
        return <Icon name="heart-fill" className="sm:w-7 w-6 h-6 sm:h-7 text-red-500" />;
        break;
      case "reply":
        return <Icon name="reply" className="sm:w-6.5 sm:h-6.5 w-6 h-6  text-yellow-500" />;
      case "retweet":
        return <Icon name="repost" className={`sm:w-6.5 sm:h-6.5 w-6 h-6  text-[#00ba7b]`} />;
      case "mention":
        return <Icon name="at-sign" className="sm:w-6.5 sm:h-6.5 w-6 h-6  text-indigo-500" />;
      case "quote":
        return <Icon name="quote-marks" className="sm:w-6.5 sm:h-6.5 w-6 h-6  text-purple-600" />;
      case "admin":
        return <Icon name="admin-icon" className={`sm:w-6.5 sm:h-6.5 w-6 h-6  text-[#00ba7b]`} />;
      case "alert":
        return <Icon name="alert-triangle" className="sm:w-6.5 sm:h-6.5 w-5.5 h-5.5  text-red-500 mt-1" />;
    }
  }, []);
  return <>{getNotificationIcon(type)}</>;
};

export default NotificationIcon;
