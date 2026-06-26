import HashtagPage from "@/components/HashtagPage/HashtagPage";
import connectToDB from "@/config/db";
import { getCurrentUser } from "@/services/authService";
import { getHashtagPosts } from "@/services/hashtagServce";

const HashtagsPage = async ({ params }) => {
  await connectToDB();
  const { hashtagName: encodeName } = await params;

  const hashtagName = decodeURIComponent(encodeName);
  // check user is login
  const currentUser = await getCurrentUser();

  const posts = await getHashtagPosts(hashtagName, currentUser);
  return (
    <div className="grid grid-cols-1 h-[calc(100vh-120px)]">
      <HashtagPage
        initialPosts={JSON.parse(JSON.stringify(posts))}
        hashtagName={hashtagName}
      />
    </div>
  );
};

export default HashtagsPage;

export async function generateMetadata({ params }) {
  const { hashtagName: encodeName } = await params;

  return {
    title: `${decodeURIComponent(encodeName)}/Twitifa`,
  };
}
