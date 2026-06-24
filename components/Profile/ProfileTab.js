"use client";

import { Tabs } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const ProfileTab = ({ username }) => {
  const { replace } = useRouter();
  const queryClient = useQueryClient();

  const pathname = usePathname();

  const activeTab = pathname.split(`/${username}/`)[1] || "";

  const handleTabChange = useCallback(
    (key) => {
      replace(`/${username}/${key}`);

      if (key === "") {
        queryClient.invalidateQueries(["user-posts", username]);
      }
    },
    [username, replace, queryClient],
  );
  return (
    <Tabs
      defaultValue=""
      className="w-full  pt-7 mt-3 overflow-x-auto"
      orientation="horizontal"
      selectedKey={activeTab}
      onSelectionChange={handleTabChange}
    >
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Authentication"
          className="sm:gap-2 gap-1 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent md:px-12 px-3"
        >
          <Tabs.Tab id="" className="tab-box ">
            توییت ها
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200 w-auto " />
          </Tabs.Tab>
          <Tabs.Tab id="reposts" className="tab-box ">
            بازنشرها
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200  outline-0" />
          </Tabs.Tab>
          <Tabs.Tab id="replies" className="tab-box ">
            پاسخ ها
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200  outline-0" />
          </Tabs.Tab>
          <Tabs.Tab id="media" className="tab-box ">
            چندرسانه ای
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200 outline-0 " />
          </Tabs.Tab>
          <Tabs.Tab id="reactions" className="tab-box ">
            واکنش ها
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200 outline-0 " />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};

export default ProfileTab;
