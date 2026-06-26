import TwitTvPage from "@/components/TwitTvPage/TwitTvPage";
import connectToDB from "@/config/db";
import { getCurrentUser } from "@/services/authService";
import { getMedia } from "@/services/twittvService";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Twit-Tv/Twitifa",
};
const TwitTv = async () => {
  await connectToDB();

  // check user is login
  const currentUser = await getCurrentUser();

  const posts = await getMedia(currentUser);
  return (
    <div>
      <TwitTvPage initialMedia={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
};

export default TwitTv;
