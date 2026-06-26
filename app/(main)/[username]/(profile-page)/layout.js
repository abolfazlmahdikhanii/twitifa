import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileTab from "@/components/Profile/ProfileTab";
import connectToDB from "@/config/db";
import followModel from "@/models/follows";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getAuthorName } from "@/utils/post";
import { ScrollShadow } from "@heroui/react";
import { notFound } from "next/navigation";

const UserLayout = async ({ children, params }) => {
  await connectToDB();

  const { username } = await params;

    const currentUser =await getCurrentUser()
  

  // get user info by username
  const user = await usersModel
    .findOne(
      { username },
      " -provider -password -emailVerified -updatedAt -accountType -avatarId -profileBgId -googleId",
    )
    .lean();

  if (!user) {
    notFound();
  }
  let follow = null;
  let sharedFollowers = null;
  if (currentUser) {
    follow = await followModel.findOne({
      follower: currentUser._id,
      following: user._id,
    });
    const currentFollowers = await followModel
      .distinct("following", {
        follower: currentUser._id,
      })
      .lean();
    const mutualFollowers = await followModel
      .distinct("follower", {
        following: user._id,
        follower: {
          $in: currentFollowers,
          // $ne: currentUser._id,
        },
      })
      .lean();

    //  Follower details
    sharedFollowers = await usersModel
      .find(
        { _id: { $in: mutualFollowers } },
        "username firstName lastName avatar organizationName",
      )
      .lean();
  }
  const [follower, following] = await Promise.all([
    followModel.countDocuments({
      following: user._id,
    }),
    followModel.countDocuments({
      follower: user._id,
    }),
  ]);
  const isMe = currentUser
    ? user._id.toString() === currentUser._id.toString()
    : false;
  const isFollow = !!follow;
  return (
    <div>
      <ScrollShadow className="h-[99vh]">
        <ProfileHeader
          {...JSON.parse(JSON.stringify(user))}
          followerCount={follower}
          followingCount={following}
          isMe={isMe}
          isFollow={isFollow}
          sharedFollowers={JSON.parse(JSON.stringify(sharedFollowers))}
        />
        <ProfileTab username={user?.username} />
        <div className="relative pt-3 px-1.5">{children}</div>
      </ScrollShadow>
    </div>
  );
};

export default UserLayout;

export async function generateMetadata({ params }) {
  await connectToDB();
  const { username } = await params;
  const user = await usersModel
    .findOne(
      { username },
      " -provider -password -emailVerified -updatedAt -avatarId -profileBgId -googleId",
    )
    .lean();

  const name = `${getAuthorName(user)}(${user.username})/Twitifa`;

  return {
    title: name,
    url: `/${user.username}`,
    openGraph: {
      title: name,
      images: [
        {
          url: "/images/ogimage.png",
          width: 500,
          height: 300,
        },
      ],
    },
  };
}
