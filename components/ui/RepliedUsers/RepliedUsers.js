import Link from "next/link";
import HoverProfile from "../Profile/HoverProfile";

const RepliedUsers = ({ repliedUser, selfReply = false }) => {
  return (
    <div className="flex items-center flex-wrap gap-x-1 sm:gap-x-1.25 text-muted text-xs sm:text-sm mb-1.5 sm:mb-2 mt-1 sm:mt-1.5 min-w-0">
      <span className="shrink-0">در پاسخ به</span>
      {repliedUser?.users.map((user, index) => (
        <div key={user.username} className="flex items-center min-w-0">
          <HoverProfile userInfo={user}>
            <Link
              className="text-blue-500 font-medium truncate max-w-25 sm:max-w-40"
              href={`/${user.username}`}
              dir="auto"
            >
              @{user.username}
            </Link>
          </HoverProfile>
          {index < repliedUser?.users?.length - 1 && (
            <span className="shrink-0">,</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default RepliedUsers;
