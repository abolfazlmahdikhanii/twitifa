"use client";

import { Modal } from "@heroui/react";
import AnalyticsChart from "./AnalyticsChart";
import EngagementBox from "./EngagmentBox";
import StatsBox from "./StatsBox";

const Analytics = (props) => {
  return (
    <Modal>
      <Modal.Backdrop
        variant="blur"
        isOpen={props.isOpen}
        onOpenChange={props.setIsOpen}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-3xl bg-[#1A1A31] shadow-none">
            {/* Header */}
            <Modal.Header
              className="flex items-center justify-between "
              dir="rtl"
            >
              <Modal.CloseTrigger className="size-7 z-4 " slot={"close"} />
              <div className="flex items-center gap-x-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-[#7b6ffd] shadow-sm shadow-[#7b6ffd]" />
                <span className="text-base text-[#9090c0] leading-0.75">
                  خلاصه عملکرد
                </span>
              </div>
            </Modal.Header>
            <Modal.Body className="pt-5 p-0  ">
              <div>
                {/* Top Stats */}
                <div className="grid grid-cols-4 gap-x-4.5 mb-4.5">
                  {/* Impressions — highlighted */}
                  <StatsBox title={"Impressions"} count={props.viewCount||0} />
                  {/* Engagements */}

                  <StatsBox title={"Engagements"} count={0} />
                  {/* Profile Views */}

                  <StatsBox title={"Profile Views"} count={0} />
                  {/* Link Clicks */}

                  <StatsBox title={" Link Clicks "} count={0} />
                </div>

                {/* Mid Row */}
                <div className="grid grid-cols-1 gap-x-4.5 mb-4.5">
                  {/* Engagement Breakdown */}

                  <EngagementBox
                    likeCount={props.likeCount}
                    repostCount={props.repostCount}
                    replyCount={props.replyCount}
                  />
                </div>

                {/* Chart */}
                <AnalyticsChart />
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default Analytics;
