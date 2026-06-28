import CompleteInfoModal from "@/components/auth/CompleteInfoModal";
import LeftSidebar from "@/components/main/LeftSidebar";
import MobileNavBar from "@/components/main/MobileNavbar";
import RightSidebar from "@/components/main/RightSidebar";
import ActiveAuthorNotify from "@/components/ui/ActiveAuthorNotify/ActiveAuthorNotiy";
import connectToDB from "@/config/db";
import notifyModel from "@/models/notifications";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MainLayout = async ({ children }) => {
  await connectToDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const refreshToken = cookieStore.get("refreshToken");

  let validToken = token?.value ? verifyToken(token.value) : null;

  if (!validToken) {
    if (!refreshToken?.value) redirect("/");
    validToken = verifyToken(refreshToken.value);
    if (!validToken) redirect("/");
  }

  const user = await usersModel
    .findOne(
      { email: validToken.email },
      "-provider -password -emailVerified -updatedAt",
    )
    .lean();

  if (!user) redirect("/auth");

  const notificationsCount = await notifyModel.countDocuments({
    recipientId: user._id,
    actorIds: { $exists: true, $not: { $size: 0 } },
    isRead: false,
  });

  const userId = user._id.toString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[220px_1fr_320px] xl:grid-cols-[280px_1fr_340px] 2xl:grid-cols-[325px_1fr_400px] md:gap-x-5 lg:gap-x-7 2xl:w-10/12 2xl:mx-auto h-full relative overflow-hidden">
      <RightSidebar
        username={user?.username}
        name={
          user?.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.organizationName
        }
        avatar={user?.avatar}
        notificationCount={notificationsCount}
      />

      <div className=" border border-x-[#34344E]">{children}</div>
      <LeftSidebar />

      {!user.organizationName && (!user.firstName || !user.lastName) && (
        <CompleteInfoModal />
      )}
      <ActiveAuthorNotify userId={userId._id} />
      <MobileNavBar
        username={user?.username}
        name={
          user?.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.organizationName
        }
        avatar={user?.avatar}
        notificationCount={notificationsCount}
      />
    </div>
  );
};

export default MainLayout;
