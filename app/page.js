import { getCurrentUser } from "@/services/authService";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/feed");
  } else {
    redirect("/auth");
  }
}
