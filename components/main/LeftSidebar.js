"use client";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
  ScrollShadow,
  Tabs,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import FilterTab from "../ui/FilterTab/FilterTab";
import FollowCard from "../ui/FollowCard/FollowCard";
import Loader from "../ui/Loader/Loader";
import SearchModal from "../ui/SearchModal/SearchModal";
import TrendItem from "../ui/TrendItem/TrendItem";
import Icon from '../ui/Icon/Icon';
import { usePathname, useRouter } from "next/navigation";
import SearchBox from "../ui/SearchBox/SearchBox";

const LeftSidebar = () => {
 const pathname = usePathname();
  const { data, isLoading } = useQuery({
    queryKey: ["sidebar-info"],
    queryFn: async () => {
      const res = await fetch(`/api/sidebar-info`);
      if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
      const data = await res.json();
      return data;
    },
  });


  return (
    <ScrollShadow
      className="py-6.5  px-2 hidden md:block"
      hideScrollBar={true}
      visibility="none"
    >
      {/* search */}
     {
      !pathname.startsWith("/search")?<SearchBox/> :null
     }
      <Card
        className={`bg-[#141428]  mt-6  pb-5.5 pt-4.5 px-0 max-h-107.5  ${isLoading ? "min-h-70" : "min-h-fit"}`}
      >
        <CardHeader className="mb-1.75 px-5">
          <p className="text-[21px] font-bold ">موضوعات داغ</p>
        </CardHeader>
        <CardContent>
          {isLoading && <Loader />}
          {data &&
            data?.trends
              .slice(0, 5)
              .map((trend) => <TrendItem key={trend._id} {...trend} />)}
        </CardContent>
        <CardFooter className="px-6.5 mt-2.5">
          {data && data.trends?.length > 5 ? (
            <Link href={"#"}>
              <p className="text-[#6366F1] text-[15px] ">نمایش بیشتر</p>
            </Link>
          ) : null}
        </CardFooter>
      </Card>
      {/* follow suggestion */}
      <Card
        className={`bg-[#141428]  mt-5 mb-8 pb-5.5 pt-4.5 px-0 max-h-107.5 ${isLoading ? "min-h-70" : "min-h-fit"}`}
      >
        <CardHeader className="mb-1.75 px-5">
          <div className="flex items-center justify-between">
            <p className="text-[21px] font-bold ">افرادی برای دنبال کردن</p>
            <Tabs
              className="w-full max-w-fit text-center"
              // onSelectionChange={(key) => setSelectedTab(key)}
            >
              <Tabs.ListContainer>
                <FilterTab>
                  <Tabs.Tab id={"verified"} className="before:hidden">
                    <Icon name="badge-check" size={18}/>

                    <Tabs.Indicator className="bg-accent shadow-none" />
                  </Tabs.Tab>
                  <Tabs.Tab id={"unverified"} className="before:hidden">
                    <Icon name="user" size={18} />

                    <Tabs.Indicator className="bg-accent shadow-none" />
                  </Tabs.Tab>
                </FilterTab>
              </Tabs.ListContainer>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="mt-1 px-5">
          {isLoading && <Loader />}
          {data &&
            data.activeUsers?.map((user) => (
              <FollowCard key={user._id} {...user} />
            ))}
        </CardContent>
        <CardFooter className="px-6 mt-2.5">
          {data && data.activeUsers?.length > 6 ? (
            <Link href={"#"}>
              <p className="text-[#6366F1] text-[15.5px]">نمایش بیشتر</p>
            </Link>
          ) : null}
        </CardFooter>
      </Card>
    </ScrollShadow>
  );
};

export default LeftSidebar;
