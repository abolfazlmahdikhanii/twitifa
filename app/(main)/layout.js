import CompleteInfoModal from "@/components/auth/CompleteInfoModal";
import LeftSidebar from "@/components/main/LeftSidebar";
import MobileNavBar from "@/components/main/MobileNavbar";
import RightSidebar from "@/components/main/RightSidebar";
import ActiveAuthorNotify from "@/components/ui/ActiveAuthorNotify/ActiveAuthorNotiy";
import connectToDB from "@/config/db";
import notifyModel from "@/models/notifications";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { Avatar } from "@heroui/react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MainLayout = async ({ children }) => {
  await connectToDB();
  // validate token
  const token = (await cookies()).get("token");
  const refreshToken = (await cookies()).get("refreshToken");
  let validToken = null;
  if (token?.value) {
    validToken = verifyToken(token?.value);
  }
  if (!validToken && refreshToken?.value) {
    const validRefreshToken = verifyToken(refreshToken?.value);
    if (!validRefreshToken) {
      validToken = null;
      redirect("/");
    }

    validToken = validRefreshToken;
  }
  // validate user
  const user = await usersModel
    .findOne(
      { email: validToken?.email },
      " -provider -password -emailVerified -updatedAt ",
    )
    .lean();
  if (!user) {
    redirect("/auth");
  }

  const userId = JSON.parse(JSON.stringify(user));
  const notificationsCount = await notifyModel
    .countDocuments({
      recipientId: user?._id,
      actorIds: { $exists: true, $not: { $size: 0 } },
      isRead: false,
    })
    .lean();

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

      <div className=" border border-x-[#34344E]">
     
        {children}
      </div>
      <LeftSidebar />

      {!user.organizationName && (!user.firstName || !user.lastName) && (
        <CompleteInfoModal />
      )}
      <ActiveAuthorNotify userId={userId._id} />
      <MobileNavBar />
    </div>
  );
};

export default MainLayout;
