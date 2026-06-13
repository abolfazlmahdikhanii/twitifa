import PostHeader from "@/components/Posts/PostHeader";
import React from "react";

const QuoteCard = ({ post, content }) => {
  
  return (
    <div className="border pt-1.5 pb-3 px-3 rounded-2xl border-[#34344E] mb-4">
      <PostHeader post={post} textContent={content} isQuote={true} />
    </div>
  );
};

export default QuoteCard;
