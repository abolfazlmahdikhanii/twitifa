import connectToDB from "@/config/db";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }) => {
  await connectToDB();
  const token = (await cookies()).get("refreshToken");
  let initialUser = null;
  if (token?.value) {
    const isVerify = verifyToken(token?.value);
    if (isVerify?.email) {
      initialUser = await usersModel
        .findOne(
          { email: isVerify.email },
          " -provider -password -emailVerified -updatedAt",
        )
        .lean();
    }
  }
  if (initialUser) redirect("/feed");
  return (
    <div className="flex items-center justify-center h-screen  gap-x-20 px-4 lg:px-0">
      <div className="relative z-10 hidden md:block">
        {/* circle */}
        <div className="bg-[rgba(17,17,212,.2)] w-64 h-64 rounded-full blur-3xl absolute top-4.5 right-12.5"></div>
        <div className="bg-[rgba(147,51,234,.2)] w-64 h-64 rounded-full blur-3xl absolute -bottom-20 left-4"></div>
      </div>

      {children}
    </div>
  );
};

export default AuthLayout;
