import ExplorerTab from "@/components/Explorer/ExplorerTab";
import SearchBox from "@/components/ui/SearchBox/SearchBox";

const ExplorerLayout = ({ children }) => {
  return (
    <div className="h-[calc(100vh-150px)]">
      <div className="mt-4 mb-3 sm:mb-1 sm:px-6 px-4">
        <SearchBox isSearchPage />
      </div>
      <ExplorerTab />
      <div className="h-full  mt-1">{children}</div>
    </div>
  );
};

export default ExplorerLayout;
