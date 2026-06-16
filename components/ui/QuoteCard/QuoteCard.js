import PostContent from "@/components/Posts/PostContent";
import PostHeader from "@/components/Posts/PostHeader";
import Link from "next/link";

const QuoteCard = ({ post, content }) => {
  let contentPost = null;

  if (post.retweetedFrom.poll) {
    contentPost = (
      <Link
        href={`/${post.author.username}/status/${post.retweetedFrom._id}`}
        className="text-sm text-blue-500 px-19 pb-5 py-2.5"
        onClick={e=>e.stopPropagation()}
      >
        نمایش نظرسنجی
      </Link>
    );
  } else if (post.retweetedFrom.media) {
    contentPost = <PostContent media={post.media} />;
  }

  return (
    <div className="border pt-1.5 pb-3 px-3 rounded-2xl border-[#34344E] mb-4">
      <PostHeader post={post} textContent={content} isQuote={true} />
      {contentPost}
    </div>
  );
};

export default QuoteCard;
