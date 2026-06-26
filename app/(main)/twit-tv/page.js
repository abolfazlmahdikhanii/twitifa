import TwitTvPage from "@/components/TwitTvPage/TwitTvPage";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getMedia } from "@/services/twittvService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
export const metadata={
  title:"Twit-Tv/Twitifa"
}
const TwitTv = async () => {
  await connectToDB();
  const token = (await cookies()).get("token");

  // check user is login
  let currentUser = null;
  if (token && token.value) {
    const validToken = verifyToken(token?.value);
    if (!validToken) currentUser = null;
    currentUser = await usersModel
      .findOne(
        { email: validToken.email },
        " -provider -password -emailVerified -updatedAt",
      )
      .lean();
  }
  const posts = await getMedia(currentUser);
  return (
    <div>
      <TwitTvPage initialMedia={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
};

export default TwitTv;
