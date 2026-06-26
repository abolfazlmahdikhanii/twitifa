


import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export async function getCurrentUser({ withDB = true } = {}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) return null;

    const validToken = verifyToken(token.value);
    if (!validToken) return null;

    if (!withDB) return validToken;

    await connectToDB();
    const user = await usersModel
      .findOne(
        { email: validToken.email },
        "-provider -password -emailVerified -updatedAt"
      )
      .lean();

    return user ?? null;
    
  } catch (error) {
    console.error("[getCurrentUser]:", error);
    return null;
  }
}