"use client";
import { Label, Radio } from "@heroui/react";
import React from "react";

const ReplyTypeItem = ({ val, title, icon }) => {
  return (
    <Radio value={val} className={"w-full items-center justify-between"}>
      <Radio.Content>
        <Label className="flex items-center gap-x-2.5 text-base">
          <div className="p-3 bg-[#6366F1] grid place-items-center rounded-full ">
            {icon}
          </div>
          {title}
        </Label>
      </Radio.Content>
      <Radio.Control className="size-5">
        <Radio.Indicator />
      </Radio.Control>
    </Radio>
  );
};

export default ReplyTypeItem;
