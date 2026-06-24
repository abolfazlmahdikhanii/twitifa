import { formatDate, formatPersianDate, formatTime } from "@/utils/date";
import { formatPostViewNumber } from "@/utils/post";
import { Dot } from "lucide-react";

const PostInfoDate = ({time,views}) => {
  return (
    <div className="flex item-center gap-x-0.5 border-b border-b-[#34344E] pt-4.5 pb-4.75 mr-16 text-muted text-sm ">
      <p>{formatTime(time)}</p>
      <Dot size={16} />
      <p>{formatDate(time)}</p>
      <Dot size={16} />
      <p ><span className="text-white font-semibold">{formatPostViewNumber(views)}</span> بازدید</p>
    </div>
  );
};

export default PostInfoDate;
