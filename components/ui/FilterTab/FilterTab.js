import { Tabs } from "@heroui/react";

const FilterTab = ({ children }) => {
  return (
    <Tabs.List
      aria-label="Options"
      className="w-fit *:h-6.75 *:w-fit *:px-2.25 *:text-sm *:font-normal *:data-[selected=true]:text-accent-foreground bg-[#1e1e38]"
    >
      {children}
    </Tabs.List>
  );
};

export default FilterTab;
