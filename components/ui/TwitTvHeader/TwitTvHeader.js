import { Tabs } from "@heroui/react";
import FilterTab from "../FilterTab/FilterTab";
import Icon from "../Icon/Icon";

const TwitTvHeader = ({ setSelectedTab }) => {
  return (
    <div className="flex items-center gap-x-2">
      <Tabs
        className="w-full max-w-lg text-center"
        onSelectionChange={(key) => setSelectedTab(key)}
      >
        <Tabs.ListContainer>
          <FilterTab>
            <Tabs.Tab id={"video"} className="before:hidden">
              <Icon name="video-player" className="w-5 h-5"  size={20}/>

              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
            <Tabs.Tab id={"image"} className="before:hidden">
              <Icon name="image" className="w-5 h-5" />

              <Tabs.Indicator className="bg-accent shadow-none" />
            </Tabs.Tab>
          </FilterTab>
        </Tabs.ListContainer>
      </Tabs>
    </div>
  );
};

export default TwitTvHeader;
