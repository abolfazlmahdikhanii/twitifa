"use client";
import { Button, InputGroup, Label, TextField } from "@heroui/react";
import { DynamicIcon } from "lucide-react/dynamic";
import React, { useId } from "react";

const Input = ({
  title,
  placeholder,
  value,
  onChange,
  type,
  startIcon,
  children,
}) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-2.5 w-full">
      <Label htmlFor={`input-type-${id}`}>{title}</Label>
      <div className="relative">
        {startIcon && (
          <DynamicIcon
            name={startIcon}
            size={20}
            className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"
          />
        )}
        <Input
          id={`input-type-${id}`}
          placeholder={placeholder}
          type={type}
          className="bg-[#27273A] border border-[#34344E] h-11.5 md:h-12.5 rounded-[24px] pr-10 pl-11 w-full"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
        />
        {children}
      </div>
    </div>
  );
};

export default Input;
