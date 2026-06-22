"use client"
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React from "react";
import Icon from "../Icon/Icon";

const PageHeader = ({title,noBorder=false}) => {
    const router=useRouter()
  return (
    <header>
      <div className={`py-4 px-7 ${!noBorder?"border-b border-[#34344E]":""} flex items-center justify-between`}>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div>
          <Button variant="ghost" className="text-base h-10 w-10" onClick={()=>router.back()}>
            <Icon name="arrow-left" className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
