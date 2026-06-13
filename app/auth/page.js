
import AuthPage from "@/components/auth/AuthPage";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const Auth = async () => {
  await connectToDB()
  const token=(await cookies()).get("refreshToken")
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
  if(initialUser) redirect("/feed")
  return <AuthPage />;
};

export default Auth;
