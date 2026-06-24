import TrendItem from "@/components/ui/TrendItem/TrendItem";
import connectToDB from "@/config/db";
import hashtagModel from "@/models/hashtag";
import { ScrollShadow } from "@heroui/react";

const TrendingPage = async () => {
  await connectToDB();
  const hashtags = await hashtagModel
    .find({ count: { $gt: 0 } }, "-__v -createdAt -updatedAt")
    .sort({ count: -1 })
    .lean();
  return (
    <div>
      <ScrollShadow className="mt-1.5">
        {hashtags.map((trend) => (
          <TrendItem isTrendPage key={trend._id} {...trend} />
        ))}
      </ScrollShadow>
    </div>
  );
};
export default TrendingPage;
