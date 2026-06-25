import TrendItem from "@/components/ui/TrendItem/TrendItem";
import connectToDB from "@/config/db";
import hashtagModel from "@/models/hashtag";
import { ScrollShadow } from "@heroui/react";

const TrendingPage = async () => {
  await connectToDB();
  // get trends
  const hashtags = await hashtagModel
    .find({ count: { $gt: 0 } }, "-__v  -updatedAt")
    .populate("posts", "isDeleted")
    .sort({ createdAt: -1 })
    .lean();

  const validHashtag = hashtags
    .map((h) => ({
      ...h,
      hashtagCount: h.posts.filter((post) => !post.isDeleted).length || 0,
    }))
    .filter((h) => h.hashtagCount > 0)
    .sort((a, b) => b.hashtagCount - a.hashtagCount)
  
  return (
    <div>
      <ScrollShadow className="mt-1.5">
        {validHashtag.map((trend) => (
          <TrendItem isTrendPage key={trend._id} {...trend} />
        ))}
      </ScrollShadow>
    </div>
  );
};
export default TrendingPage;
