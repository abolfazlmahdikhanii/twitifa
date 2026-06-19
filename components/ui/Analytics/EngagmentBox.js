import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import EngagementItem from "./EngagementItem";

const EngagementBox = ({ likeCount, repostCount, replyCount }) => {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl py-4 px-5">
      <div className="flex items-center gap-x-1.5 mb-5.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#7b6ffd]" />
        <span className="text-sm text-[#9090c0]">تفکیک تعاملات</span>
      </div>
      <div className="flex items-center justify-around">
        <EngagementItem
          bg={"rgba(96,165,250,0.12)"}
          color={"#60a5fa"}
          value={replyCount}
          icon={<MessageCircle size={19} />}
        />
        <EngagementItem
          bg={"rgba(123,111,253,0.12)"}
          color={"#7b6ffd"}
          value={repostCount}
          icon={<Repeat2 size={23} />}
        />
        <EngagementItem
          bg={"rgba(244,114,182,0.12)"}
          color={"#f472b6"}
          value={likeCount}
          icon={<Heart size={20} />}
        />
      </div>
    </div>
  );
};

export default EngagementBox;
