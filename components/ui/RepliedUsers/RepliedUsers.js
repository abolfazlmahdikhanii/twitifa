import React from "react";
import HoverProfile from "../Profile/HoverProfile";
import Link from "next/link";

const RepliedUsers = ({ repliedUser ,selfReply=false}) => {
  
  
  return (
    <div className={`flex items-center gap-x-1.25 text-muted text-sm  mb-2 mt-1.5 `}>
      در پاسخ به
      {repliedUser?.users.map((user, index) => (
        <div key={user.username}>
          <HoverProfile userInfo={user}>
            <Link
              className=" text-blue-500 font-medium"
              href={`/${user.username}`}
              dir="auto"
            >
              @{user.username}
            </Link>
          </HoverProfile>
          {index < repliedUser?.users?.length - 1 && <span>,</span>}
        </div>
      ))}
    </div>
  );
};

export default RepliedUsers;
