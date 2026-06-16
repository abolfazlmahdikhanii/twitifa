import PageHeader from "@/components/ui/PageHeader/PageHeader";
import PostActivityTab from "@/components/ui/PostActivityTab/PostActivityTab";

export const PostActivityLayout = async ({ children, params }) => {
  const { username, postID } = await params;

  return (
    <div className="h-[calc(100vh-90px)]">
      <PageHeader title="فعالیت پست" noBorder />
      <PostActivityTab username={username} postId={postID} />
      {children}
    </div>
  );
};

export default PostActivityLayout;
