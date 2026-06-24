import ExplorerTab from "@/components/Explorer/ExplorerTab";

const ExplorerLayout = ({ children }) => {
  return (
    <div className="h-full">
      <ExplorerTab />
      <div className="h-[calc(100vh-90px)]  mt-1">{children}</div>
    </div>
  );
};

export default ExplorerLayout;
