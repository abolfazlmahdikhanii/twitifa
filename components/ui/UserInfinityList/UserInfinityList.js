// کامپوننت عمومی برای رندر لیست‌های ساده (پست، ریپست، لایک)
import { Virtuoso } from "react-virtuoso";
import Loader from "../ui/Loader/Loader";
import EmptyData from "../ui/EmptyData/EmptyData";
import PostCard from "../Posts/PostCard";

export const UserInfiniteList = ({
  query,
  emptyText = "هیچ توییتی وجود ندارد",
}) => {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    query;


  const posts = data?.pages?.flatMap((page) => page.posts) || [];

  if (isPending) return <Loader />;
  if (!isPending && posts.length === 0) return <EmptyData text={emptyText} />;

  const Footer = () => {
    return isFetchingNextPage ? (
      <div className="py-4 flex justify-center">
        <Loader />
      </div>
    ) : null;
  };

  return (
    <div style={{ height: "calc(100vh - 120px)" }}>
      <Virtuoso
        data={posts}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        computeItemKey={(index, post) => post._id}
        itemContent={(index, post) => <PostCard post={post} />}
        components={{ Footer }}
      />
    </div>
  );
};
