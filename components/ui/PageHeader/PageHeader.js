"use client"
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";

const PageHeader = ({title}) => {
    const router=useRouter()
  return (
    <header>
      <div className="py-4 px-7 border-b border-[#34344E] flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div>
          <Button variant="ghost" className="text-base h-10 w-10" onClick={()=>router.back()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
