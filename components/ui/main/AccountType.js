"use client";
import { Description, Label, Radio, RadioGroup } from "@heroui/react";
import Icon from "../Icon/Icon";

const deliveryOptions = [
  {
    description: "استفاده شخصی",
    icon: `simple-user`,
    title: "حساب حقیقی",
    value: "personal",
  },
  {
    description: "شرکت ها و سازمان ها",
    icon: "building",
    title: "حساب حقوقی",
    value: "legal",
  },
];
const AccountType = ({ setType, defaultType }) => {
  return (
    <section className="flex w-full  flex-col gap-4">
      <RadioGroup
        defaultValue={"personal"}
        name="account"
        variant="secondary"
        onChange={(value) => setType(value)}
        value={defaultType}
      >
        <Label>نوع حساب کاربری خود را انتخاب کنید</Label>
        <div className="grid gap-x-6 md:grid-cols-2 mt-1">
          {deliveryOptions.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              className={`
                group relative flex-col gap-4 rounded-2xl border-2  bg-[#131428] cursor-pointer px-5 py-4 transition-all data-[selected=true]:border-accent data-[selected=true]:bg-accent/10
                data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10  border-[#34344E]`}
            >
              <Radio.Control className="absolute top-3 left-4 size-4">
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content className="flex flex-col gap-4 items-center justify-center w-full pb-1 ">
                <div className="mt-1 w-14 h-14 bg-accent-soft-hover rounded-full grid place-items-center">
                
                  <Icon name={option.icon} size={28}/>
                </div>
                <div className="flex flex-col gap-1.5  justify-center items-center">
                  <Label className="text-base">{option.title}</Label>
                  <Description className="text-sm">
                    {option.description}
                  </Description>
                </div>
              </Radio.Content>
            </Radio>
          ))}
        </div>
      </RadioGroup>
    </section>
  );
};

export default AccountType;
