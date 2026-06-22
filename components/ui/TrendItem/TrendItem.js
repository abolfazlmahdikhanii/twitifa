import Link from "next/link";
import Icon from "../Icon/Icon";

const TrendItem = ({
  hashtag,
  hashtagCount,
  name,
  count,
  isTrendPage = false,
}) => {
  return (
    <Link
      href={`/hashtag/${name}`}
      className={`${isTrendPage ? "pr-7 pl-6 py-4" : "pr-5 pl-3.75 py-3"} transition-all duration-200 dark:hover:bg-white/10 hover:bg-slate-200 flex items-center justify-between`}
    >
      <div>
        <div className="mb-1.25">
          <p
            className={`font-bold truncate block ${isTrendPage ? "text-[18px]" : ""}`}
          >
            {hashtag}
          </p>
        </div>
        <p
          className={`dark:text-neutral-400 text-neutral-500 mr-0.5 ${isTrendPage ? "text-[15px] mt-1" : ""}`}
        >
          {hashtagCount} پست
        </p>
      </div>
      <Icon name="chevron-left" className="w-5 h-5 text-muted" />
    </Link>
  );
};

export default TrendItem;
