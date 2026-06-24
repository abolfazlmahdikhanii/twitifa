import Link from "next/link";
import Icon from "../Icon/Icon";

const TrendItem = ({
  hashtag,
  name,
  count,
  isTrendPage = false,
}) => {
  return (
    <Link
      href={`/hashtag/${name}`}
      className={`${
        isTrendPage
          ? "pr-4 sm:pr-7 pl-3 sm:pl-6 py-3 sm:py-4"
          : "pr-3 sm:pr-5 pl-2.5 sm:pl-3.75 py-2.5 sm:py-3"
      } transition-all duration-200 dark:hover:bg-white/10 hover:bg-slate-200 flex items-center justify-between gap-x-2`}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 sm:mb-1.25">
          <p
            className={`font-bold truncate block ${
              isTrendPage ? "text-base sm:text-[18px]" : "text-sm sm:text-base"
            }`}
          >
            {hashtag}
          </p>
        </div>
        <p
          className={`dark:text-neutral-400 text-neutral-500 mr-0.5 ${
            isTrendPage
              ? "text-xs sm:text-[15px] mt-0.5 sm:mt-1"
              : "text-xs sm:text-sm"
          }`}
        >
          {count} پست
        </p>
      </div>
      <Icon name="chevron-left" className="w-4 h-4 sm:w-5 sm:h-5 text-muted shrink-0" />
    </Link>
  );
};

export default TrendItem;