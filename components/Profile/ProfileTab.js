"use client";

import { Tabs } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

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
      defaultValue="signin"
      className="w-full  pt-7 mt-3"
      orientation="horizontal"
      selectedKey={activeTab}
      onSelectionChange={handleTabChange}
    >
      <Tabs.ListContainer>
        <Tabs.List
          aria-label="Authentication"
          className="gap-2 w-full relative rounded-none p-0 border-b border-[#34344E] bg-transparent px-12"
        >
          <Tabs.Tab
            id=""
            className="w-full py-6 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:w-0"
          >
            توییت ها
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200 w-auto " />
          </Tabs.Tab>
          <Tabs.Tab
            id="reposts"
            className="w-full py-6 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:w-0"
          >
            بازنشرها
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200  outline-0" />
          </Tabs.Tab>
          <Tabs.Tab
            id="replies"
            className="w-full py-6 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:w-0"
          >
            پاسخ ها
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200  outline-0" />
          </Tabs.Tab>
          <Tabs.Tab
            id="media"
            className="w-full py-6 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-b-[#1111D4] rounded-none data-[selected=true]:font-bold before:w-0"
          >
            چندرسانه ای
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200 outline-0 " />
          </Tabs.Tab>
          <Tabs.Tab
            id="reactions"
            className="w-full py-6 text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-4 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold before:w-0"
          >
            واکنش ها
            <Tabs.Indicator className="bg-transparent rounded-none shadow-none transition-all duration-200 outline-0 " />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};

export default ProfileTab;
