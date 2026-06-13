import React, { useCallback, useMemo } from "react";
import HoverProfile from "../Profile/HoverProfile";
import { getAuthorName } from "@/utils/post";

const NotificationType = ({ actorIds = [], message = "", type }) => {
  const actionText = useMemo(
    () => ({
      follow: { single: "شما را دنبال کرد", plural: "شما را دنبال کردند" },
      like: { single: "پست شما را پسندید", plural: "پست شما را پسندیدند" },
      mention: { single: " شما را منشن کرد", plural: " شما را منشن کردند" },
      retweet: {
        single: "پست شما را بازنشر کرد",
        plural: "پست شما را بازنشر کردند",
      },
      reply: {
        single: "برای پست شما پاسخ ثبت کرد",
        plural: "برای پست شما پاسخ ثبت کردند ",
      },
      quote: {
        single: "برای پست شما نقل قولی ثبت کرد",
        plural: "برای پست شما نقل قولی ثبت کردند ",
      },
    }),
    [],
  );

  const renderActor = useCallback(() => {
    if (type !== "admin" || type !== "alert") {
      return (
        <>
          <>
            {actorIds.slice(0, 3).map((actor, index) => (
              <React.Fragment key={actor._id || index}>
                <HoverProfile userInfo={actor}>
                  <span className="cursor-pointer">
                    {" "}
                    {getAuthorName(actor)}
                  </span>
                </HoverProfile>
                {index < Math.min(2, actorIds.length - 1) && "، "}
              </React.Fragment>
            ))}
          </>
          {actorIds.length > 3 ? (
            <span className="">
              {" "}
              و {actorIds.length - 3} نفر دیگر {actionText[type].plural}
            </span>
          ) : actorIds.length > 1 ? (
            <span className="mr-1.25">{actionText[type].plural}</span>
          ) : (
            <span className="mr-1.25">{actionText[type].single}</span>
          )}
        </>
      );
    } else {
      return (
        <>
          <p>{message}</p>
        </>
      );
    }
  }, [actorIds, actionText, message, type]);

  return (
    <>
      <p className="text-[16.5px] leading-[1.6] text-white pr-1.5">
        {renderActor()}
      </p>
    </>
  );
};

export default NotificationType;
