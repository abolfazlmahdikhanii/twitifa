import ResetPassword from "@/components/auth/ResetPassword";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ResetPage = async () => {
  const token = (await cookies()).get("reset_session");
  if (!token?.value) {
    redirect("/auth/forgot-password");
  }
  return <div>
    <ResetPassword/>
  </div>;
};

export default ResetPage;
