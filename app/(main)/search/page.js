import SearchResultPage from "@/components/SearchResultPage/SearchResultPage";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getSearchResult } from "@/services/searchService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

const SearchPage = async ({ searchParams }) => {
  await connectToDB();
  const token = (await cookies()).get("token");
  const searchUrl = await searchParams;
  const search = searchUrl.q ? decodeURIComponent(searchUrl.q) : "";
  const cursor=searchUrl.cursor||null
  const type=searchUrl.type||"top"
  // check user is login
  let currentUser = null;
  if (token && token.value) {
    const validToken = verifyToken(token?.value);
    if (!validToken) currentUser = null;
    currentUser = await usersModel
      .findOne(
        { email: validToken.email },
        " -provider -password -emailVerified -updatedAt",
      )
      .lean();
  }
  const result = await getSearchResult(search, currentUser,cursor,10,type);

  return (
    <div>
      <SearchResultPage
        initialResult={JSON.parse(JSON.stringify(result))}
        searchQuery={search}
      />
    </div>
  );
};

export default SearchPage;
export async function generateMetadata({ searchParams }) {
   const searchUrl = await searchParams;
  const search = searchUrl.q ? decodeURIComponent(searchUrl.q) : "";

  return{
    title:`${search}-Search/Twitifa`
  }
}