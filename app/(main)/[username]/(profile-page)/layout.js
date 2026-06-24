import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileTab from "@/components/Profile/ProfileTab";
import connectToDB from "@/config/db";
import followModel from "@/models/follows";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { ScrollShadow } from "@heroui/react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

const UserLayout = async ({ children, params }) => {
  await connectToDB();
  const token = (await cookies()).get("token");
  const { username } = await params;

  let currentUser = null;
  // check exist token
  if (token && token.value) {
    // validate user
    const validToken = verifyToken(token?.value);
    if (!validToken) {
      currentUser = null;
    }
    currentUser = await usersModel
      .findOne(
        { email: validToken.email },
        " -provider -password -emailVerified -updatedAt",
      )
      .lean();
  }

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
