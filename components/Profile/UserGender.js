import { Label,ListBox,Select } from "@heroui/react";
import { Users } from "lucide-react";

const UserGender = ({setGender,setHasChange,gender}) => {
  return (
    <Select
      className="w-full text-right h-full flex flex-col gap-3 "
      placeholder="گزینه را انتخاب کنید"
      dir="rtl"
      onChange={(value) => {
        setGender(value);
        setHasChange(true);
      }}
      value={gender}
    >
      <Label className="dark:text-neutral-400 text-neutral-500">جنسیت</Label>
      <Select.Trigger className="input-lg flex items-center justify-between text-right">
        <Select.Value className={"text-right text-[15px]"} />
        <Users size={23} className="input-icon" />
      </Select.Trigger>
      <Select.Popover className={"bg-[#191933] border border-[#34344E] "}>
        <ListBox>
          <ListBox.Item
            id="man"
            textValue="man"
            className="hover:bg-[#34344E] h-10"
          >
            مرد
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item
            id="woman"
            textValue="woman"
            className="hover:bg-[#34344E] h-10"
          >
            زن
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default UserGender;
