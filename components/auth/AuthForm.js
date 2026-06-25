"use client";
import { Tabs } from "@heroui/react";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("signin");

  const tabClass =
    "w-full py-4 sm:py-6 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 dark:data-[selected=true]:text-white border-b-2 border-transparent data-[selected=true]:border-[#1111D4] rounded-none data-[selected=true]:font-bold";

  return (
    <div className="w-full mt-8 sm:mt-14 md:mt-0 md:w-120 rounded-xl sm:rounded-2xl border border-[#34344E] bg-[#1e1e2e] overflow-hidden shadow-lg">
      <Tabs
        defaultValue="signin"
        className="w-full"
        orientation="horizontal"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key)}
      >
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Authentication"
            className="gap-3 sm:gap-6 w-full relative rounded-none p-0 border-b border-[#34344E] bg-[#151525]"
          >
            <Tabs.Tab id="signin" className={tabClass}>
              ورود
              <Tabs.Indicator className="bg-white/5 rounded-none shadow-none transition-all duration-200" />
            </Tabs.Tab>
            <Tabs.Tab id="signup" className={tabClass}>
              ثبت نام
              <Tabs.Indicator className="bg-white/5 rounded-none shadow-none transition-all duration-200" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        <Tabs.Panel id="signin" className="p-0 pt-5 sm:pt-7">
          <Login setActiveTab={setActiveTab} />
        </Tabs.Panel>
        <Tabs.Panel id="signup" className="p-0 pt-5 sm:pt-7">
          <Register setActiveTab={setActiveTab} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default AuthForm;