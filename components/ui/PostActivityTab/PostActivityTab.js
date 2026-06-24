"use client"
import { Tabs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const TABS = [
  { id: "quotes", label: "نقل قول ها" },
  { id: "reposts", label: "بازنشرها" },
];


const PostActivityTab = ({ username, postId }) => {
      const { replace } = useRouter();
      const pathname=usePathname()
      const activeTab=pathname.split("/")[4]||""
  const handleTabChange = useCallback(
    (key) => {
      replace(`/${username}/status/${postId}/${key}`);
    },
    [username, postId, replace],
  );
  return (
    <div>
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={handleTabChange}
        className="w-full  shrink-0"
        orientation="horizontal"
      >
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Hashtag Tabs"
            className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent sm:px-12 px-4"
          >
            {TABS.map((tab) => (
              <Tabs.Tab key={tab.id} id={tab.id} className={"tab-box"}>
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </div>
  );
};

export default PostActivityTab;
