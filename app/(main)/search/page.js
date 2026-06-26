import SearchResultPage from "@/components/SearchResultPage/SearchResultPage";
import connectToDB from "@/config/db";
import { getCurrentUser } from "@/services/authService";
import { getSearchResult } from "@/services/searchService";

const SearchPage = async ({ searchParams }) => {
  await connectToDB();

  const searchUrl = await searchParams;
  const search = searchUrl.q ? decodeURIComponent(searchUrl.q) : "";
  const cursor = searchUrl.cursor || null;
  const type = searchUrl.type || "top";
  // check user is login
  const currentUser = await getCurrentUser();

  const result = await getSearchResult(search, currentUser, cursor, 10, type);

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

  return {
    title: `${search}-Search/Twitifa`,
  };
}
