import { Button, Dropdown, Label, Tabs } from "@heroui/react";
import React from "react";
import FilterTab from "../FilterTab/FilterTab";
import { CircleSmall, EllipsisVertical } from "lucide-react";

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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 22.0002H14C17.7712 22.0002 19.6569 22.0002 20.8284 20.8286C22 19.6571 22 17.7714 22 14.0002C22 10.229 22 8.34335 20.8284 7.17178C20.4658 6.80918 20.0343 6.5588 19.4996 6.38591C19.5 6.55544 19.5 6.72881 19.5 6.90517L19.5 9.06327C19.5 9.09263 19.5003 9.12461 19.5006 9.15893C19.5035 9.49938 19.5085 10.07 19.264 10.592C19.0195 11.1141 18.578 11.4756 18.3145 11.6913C18.2882 11.7128 18.263 11.7334 18.2407 11.752L16.7342 13.0075C15.8734 13.7248 15.1241 14.3493 14.4505 14.7825C13.7245 15.2495 12.9391 15.5949 12 15.5949C11.0609 15.5949 10.2756 15.2495 9.54949 14.7825C8.87589 14.3493 8.12661 13.7248 7.26587 13.0075L5.75937 11.752C5.73681 11.7333 5.71207 11.713 5.68551 11.6913C5.42207 11.4756 4.98056 11.1141 4.73604 10.592C4.49152 10.07 4.49648 9.49938 4.49944 9.15893C4.49973 9.12462 4.50001 9.09262 4.50001 9.06327L4.50001 6.90516C4.49999 6.72858 4.49998 6.55528 4.5004 6.38556C3.96577 6.55846 3.53442 6.80893 3.17157 7.17178C2 8.34335 2 10.229 2 14.0002C2 17.7714 2 19.6571 3.17157 20.8286C4.34314 22.0002 6.22877 22.0002 10 22.0002Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.71972 10.5997L8.15898 11.7991C9.99562 13.3296 10.9139 14.0949 12.0001 14.0949C13.0862 14.0949 14.0046 13.3296 15.8412 11.7991L17.2805 10.5997C17.6343 10.3048 17.8113 10.1574 17.9057 9.95578C18.0001 9.75421 18.0001 9.52389 18.0001 9.06325V7C18.0001 6.67937 18.0001 6.38054 17.9982 6.10169C17.9865 4.3306 17.9005 3.36486 17.2679 2.73223C16.5356 2 15.3571 2 13.0001 2H11.0001C8.64306 2 7.46455 2 6.73232 2.73223C6.09969 3.36486 6.01179 4.3306 6.00009 6.10169C5.99824 6.38054 6.00009 6.67937 6.00009 7V9.06325C6.00009 9.52389 6.00009 9.75421 6.0945 9.95578C6.18891 10.1574 6.36584 10.3048 6.71972 10.5997ZM9.25 6C9.25 5.58579 9.58579 5.25 10 5.25H14C14.4142 5.25 14.75 5.58579 14.75 6C14.75 6.41421 14.4142 6.75 14 6.75H10C9.58579 6.75 9.25 6.41421 9.25 6ZM10.25 9C10.25 8.58579 10.5858 8.25 11 8.25H13C13.4142 8.25 13.75 8.58579 13.75 9C13.75 9.41421 13.4142 9.75 13 9.75H11C10.5858 9.75 10.25 9.41421 10.25 9Z"
                  fill="currentColor"
                />
              </svg>

              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
            <Tabs.Tab id={"all"} className="before:hidden">
              <CircleSmall size={20} fill="currentColor" />

              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
            <Tabs.Tab id={"unread"} className="before:hidden">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157ZM18.5762 7.51986C18.8413 7.83807 18.7983 8.31099 18.4801 8.57617L16.2837 10.4066C15.3973 11.1452 14.6789 11.7439 14.0448 12.1517C13.3843 12.5765 12.7411 12.8449 12 12.8449C11.2589 12.8449 10.6157 12.5765 9.95518 12.1517C9.32112 11.7439 8.60271 11.1452 7.71636 10.4066L5.51986 8.57617C5.20165 8.31099 5.15866 7.83807 5.42383 7.51986C5.68901 7.20165 6.16193 7.15866 6.48014 7.42383L8.63903 9.22291C9.57199 10.0004 10.2197 10.5384 10.7666 10.8901C11.2959 11.2306 11.6549 11.3449 12 11.3449C12.3451 11.3449 12.7041 11.2306 13.2334 10.8901C13.7803 10.5384 14.428 10.0004 15.361 9.22291L17.5199 7.42383C17.8381 7.15866 18.311 7.20165 18.5762 7.51986Z"
                  fill="currentColor"
                />
              </svg>

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
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.0299 2.47998L4.17993 18.33"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.25008 12.9999C4.83008 12.0299 4.58008 10.9799 4.58008 9.89993C4.58008 4.98993 8.80008 1.11993 13.6001 2.16993C15.0601 2.48993 16.3601 3.26993 17.3601 4.34993"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.0599 7.30005C20.2799 11.18 18.3099 15.08 15.5199 16.87V18.03C15.5199 18.32 15.6199 18.99 14.6199 18.99H9.41991C8.38991 18.99 8.51991 18.56 8.51991 18.03V16.87C8.03991 16.57 7.58991 16.2 7.15991 15.77"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 22C10.79 21.35 13.21 21.35 15.5 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

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
