import { Label,Autocomplete, SearchField, ListBox, useFilter } from "@heroui/react";
import { Earth } from "lucide-react";
import countryFlagEmoji from "country-flag-emoji"
const UserNation = ({setSelectedNation,setHasChange,selectedNation}) => {
     const { contains } = useFilter({ sensitivity: "base" });
  return (
    <Autocomplete
      className="w-full text-right h-full flex flex-col gap-3 "
      placeholder="گزینه را انتخاب کنید"
      dir="rtl"
      selectionMode="single"
      defaultValue={"IR"}
      value={selectedNation}
      onChange={(value) => {
        setSelectedNation(value);
        setHasChange(true);
      }}
    >
      <Label className="dark:text-neutral-400 text-neutral-500">ملیت</Label>
      <Autocomplete.Trigger className="input-lg flex items-center justify-between text-right">
        <Autocomplete.Value
          className={"text-right  text-[15px] flex items-center gap-1"}
        >
          <span>{countryFlagEmoji.get(selectedNation)?.name}</span>
        </Autocomplete.Value>
        <Earth size={23} className="input-icon" />
      </Autocomplete.Trigger>
      <Autocomplete.Popover
        className={"bg-[#191933] border border-[#34344E] relative "}
      >
        <Autocomplete.Filter filter={contains}>
          <SearchField
            autoFocus
            name="search"
            className={"sticky -top-2 pt-3 z-10 bg-[#191933]"}
          >
            <SearchField.Group className="input-lg h-11! mb-1">
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="جستجو کردن..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox variant="danger">
            {countryFlagEmoji?.list.map((item) => (
              <ListBox.Item
                key={item.code}
                id={item.code}
                textValue={item.name}
                className="hover:bg-[#34344E] transition-all duration-75 h-12 flex items-center gap-3 pr-3"
              >
                <div className=" text-3xl">{item.emoji}</div>
                <div className="flex flex-col">
                  <Label className="text-[15px]">{item.name}</Label>
                </div>
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  );
};

export default UserNation;
