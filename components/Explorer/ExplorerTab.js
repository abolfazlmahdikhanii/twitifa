"use client";

import { Tabs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const ExplorerTab = () => {
  const { replace } = useRouter();
  const pathname = usePathname();

  let activeTab = "for-you";

  if (pathname.startsWith("/explorer/tabs/")) {
    activeTab = pathname.split("/explorer/tabs/")[1];
  } else if (pathname === "/explorer") {
    activeTab = "for-you";
  }

  const handleTabChange = useCallback(
    (key) => {
      replace(`/explorer/tabs/${key}`);
    },
    [replace],
  );

  return (
    <Tabs
      className="w-full pt-1 sm:pt-5"
      orientation="horizontal"
      selectedKey={activeTab}
      onSelectionChange={handleTabChange}
    >
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Explorer tabs"
          className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent sm:px-12 px-4"
        >
          <Tabs.Tab id="for-you" className={"tab-box"}>
            برای شما
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200 w-auto " />
          </Tabs.Tab>
          <Tabs.Tab id="trending" className={"tab-box"}>
            موضوعات داغ
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200  outline-0" />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};

export default ExplorerTab;
