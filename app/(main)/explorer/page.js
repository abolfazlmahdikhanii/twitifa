import ExplorerClient from "@/components/Explorer/ExplorerClient";

import connectToDB from "@/config/db";

import { getCurrentUser } from "@/services/authService";
import { getExplorer } from "@/services/explorerService";

const ExplorerPage = async () => {
  await connectToDB();
  const currentUser = await getCurrentUser();

  const posts = await getExplorer(currentUser);

  return (
    <div className="grid grid-cols-1 h-full">
      <ExplorerClient initialPosts={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
};

export default ExplorerPage;
