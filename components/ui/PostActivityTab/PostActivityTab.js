"use client"
import { Tabs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const TABS = [
  { id: "quotes", label: "نقل قول ها" },
  { id: "reposts", label: "بازنشرها" },
];

const TAB_CLASS =
  "w-full py-7 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:hidden";

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
            className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent px-12"
          >
            {TABS.map((tab) => (
              <Tabs.Tab key={tab.id} id={tab.id} className={TAB_CLASS}>
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
