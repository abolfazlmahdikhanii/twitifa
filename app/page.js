
import { getCurrentUser } from "@/services/authService";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/feed");
  } else {
    redirect("/auth");
  }
}
