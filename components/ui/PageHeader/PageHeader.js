"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import Icon from "../Icon/Icon";

const PageHeader = ({ title, noBorder = false }) => {
  const router = useRouter();

  return (
    <header>
      <div
        className={`py-3 sm:py-4 px-4 sm:px-7 ${!noBorder ? "border-b border-[#34344E]" : ""} flex items-center justify-between`}
      >
        <h2 className="text-base sm:text-xl font-bold">{title}</h2>

        <Button
          variant="ghost"
          className="text-base h-8 w-8 sm:h-10 sm:w-10"
          onClick={() => router.back()}
          isIconOnly
        >
          <Icon name="arrow-left" className="size-4 sm:size-5" />
        </Button>
      </div>
    </header>
  );
};

export default PageHeader;