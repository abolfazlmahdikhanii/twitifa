import PostContent from "@/components/Posts/PostContent";
import PostHeader from "@/components/Posts/PostHeader";
import Link from "next/link";

const QuoteCard = ({ post, content }) => {
  let contentPost = null;

  if (post.retweetedFrom.poll) {
    contentPost = (
      <Link
        href={`/${post.author.username}/status/${post.retweetedFrom._id}`}
        className="text-xs sm:text-sm text-blue-500 pr-14 sm:pr-19 pb-3 sm:pb-5 py-2 sm:py-2.5 block"
        onClick={(e) => e.stopPropagation()}
      >
        نمایش نظرسنجی
      </Link>
    );
  } else if (post.retweetedFrom.media) {
    contentPost = (
      <div className="px-1 sm:px-0">
        <PostContent media={post.media} />
      </div>
    );
  }

  return (
    <div className="border pt-1.5 pb-2.5 sm:pb-3 px-3  rounded-xl sm:rounded-2xl border-[#34344E] mb-3 sm:mb-4 w-full overflow-hidden">
      <PostHeader post={post} textContent={content} isQuote={true} />
      {contentPost}
    </div>
  );
};

export default QuoteCard;
