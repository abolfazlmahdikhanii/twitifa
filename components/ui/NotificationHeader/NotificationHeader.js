import { Button, Dropdown, Label, Tabs } from "@heroui/react";
import { CircleSmall, EllipsisVertical } from "lucide-react";
import FilterTab from "../FilterTab/FilterTab";
import Icon from "../Icon/Icon";

const NotificationHeader = ({
  setSelectedTab,
  readAllNotification,
  isAllRead,
}) => {
  return (
    <div className="flex items-center gap-x-1.5 sm:gap-x-2">
      <Tabs
        className="w-full max-w-lg text-center"
        onSelectionChange={(key) => setSelectedTab(key)}
      >
        <Tabs.ListContainer>
          <FilterTab>
            <Tabs.Tab id="read" className="before:hidden">
              <Icon name="inbox" className="w-4 h-4 sm:w-5 sm:h-5" />
              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
            <Tabs.Tab id="all" className="before:hidden">
              <CircleSmall
                size={18}
                fill="currentColor"
                className="sm:hidden"
              />
              <CircleSmall
                size={20}
                fill="currentColor"
                className="hidden sm:block"
              />
              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
            <Tabs.Tab id="unread" className="before:hidden">
              <Icon name="inbox-mail" className="w-4 h-4 sm:w-5 sm:h-5" />
              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
          </FilterTab>
        </Tabs.ListContainer>
      </Tabs>

      <Dropdown key="normal">
        <Button
          variant="ghost"
          className="[&>svg]:size-4 sm:[&>svg]:size-5"
          isIconOnly
        >
          <EllipsisVertical />
        </Button>
        <Dropdown.Popover
          className="border-none shadow-none bg-[#1A1A31] rounded-[24px] w-70 sm:w-82"
          placement="bottom left"
        >
          <Dropdown.Menu>
            <Dropdown.Item
              id="read-notifications"
              textValue="read notifications"
              onAction={() => readAllNotification()}
              isDisabled={isAllRead}
            >
              <div className="flex items-center gap-x-2">
                <Icon
                  name="mark-all-read"
                  className="size-4 sm:size-5 shrink-0"
                />
                <Label className="hidden sm:block text-[15px] whitespace-nowrap">
                  علامت زدن همه به عنوان خوانده شده
                </Label>
                <Label className=" sm:hidden text-[13px] whitespace-nowrap">
                  علامت زدن همه 
                </Label>
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
};

export default NotificationHeader;
