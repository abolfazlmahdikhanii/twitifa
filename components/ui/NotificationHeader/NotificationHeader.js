import { Button, Dropdown, Label, Tabs } from "@heroui/react";
import React from "react";
import FilterTab from "../FilterTab/FilterTab";
import { CircleSmall, EllipsisVertical } from "lucide-react";
import Icon from "../Icon/Icon";

const NotificationHeader = ({
  setSelectedTab,
  readAllNotification,
  isAllRead,
}) => {
  return (
    <div className="flex items-center gap-x-2">
      <Tabs
        className="w-full max-w-lg text-center"
        onSelectionChange={(key) => setSelectedTab(key)}
      >
        <Tabs.ListContainer>
          <FilterTab>
            <Tabs.Tab id={"read"} className="before:hidden">
              <Icon name="inbox" className="w-5 h-5" />

              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
            <Tabs.Tab id={"all"} className="before:hidden">
              <CircleSmall size={20} fill="currentColor" />

              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
            <Tabs.Tab id={"unread"} className="before:hidden">
              <Icon name="inbox-mail" className="w-5 h-5" />

              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
          </FilterTab>
        </Tabs.ListContainer>
      </Tabs>
      <Dropdown key={"normal"}>
        <Button variant="ghost" className={"[&>svg]:size-5 "} isIconOnly>
          <EllipsisVertical />
        </Button>

        <Dropdown.Popover
          className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-82"
          placement="bottom left"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              id={`read-notifications`}
              textValue="read notifications"
              onAction={() => readAllNotification()}
              isDisabled={isAllRead}
            >
              <Icon name="mark-all-read" className="size-5" />

              <Label className="text-[15px]">
                علامت زدن همه به عنوان خوانده شده
              </Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
};

export default NotificationHeader;
