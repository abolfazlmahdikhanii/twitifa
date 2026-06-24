"use client";
import { formatTimeLeft, getPercent } from "@/utils/post";
import { Dot } from "lucide-react";
import { useState } from "react";
import Icon from "../ui/Icon/Icon";

const PollCard = ({
  options,
  duration,
  votedBy,
  updatedAt,
  isUserLogin,
  totalVote,
  votedOption,
}) => {
  const [selectedVote, setSelectedVote] = useState(votedOption?._id ?? null);

  return (
    <div className="py-2.5 sm:py-3.5 w-full">
      {/* Options */}
      <section className="pb-3 sm:pb-4.5 space-y-3 sm:space-y-4.5">
        {options.map((option) => {
          const isSelected =
            selectedVote === option._id || votedOption?._id === option._id;
          const percent = getPercent(option.votes, totalVote);

          return (
            <div className="relative" key={option._id}>
              <div
                className={`poll-item h-full relative overflow-hidden ${
                  isSelected ? "bg-[#16162D]/35" : "bg-[#1D1D34]/55"
                }`}
              >
                {/* Progress bar */}
                <div
                  className="absolute top-0 right-0 h-full rounded-r-xl transition-all duration-700"
                  style={{
                    width: `${percent}%`,
                    background:
                      isSelected || Math.max(option.votes)
                        ? "#272464"
                        : "#313146",
                  }}
                />

                {/* Content */}
                <div className="flex items-center justify-between relative z-10 h-full mt-0.5 gap-x-2">
                  <div className="flex items-center gap-x-1.5 sm:gap-x-2 min-w-0">
                    <p
                      className={`text-sm sm:text-base truncate ${
                        isSelected || Math.max(option.votes)
                          ? "font-bold text-white"
                          : "font-medium text-[#94a3b8]"
                      }`}
                    >
                      {option.optionText}
                    </p>
                    {isSelected && (
                      <Icon
                        name="check-circle"
                        className="size-4 sm:size-5 text-[#94a3b8] shrink-0"
                      />
                    )}
                  </div>
                  <p
                    className={`text-xs sm:text-sm shrink-0 ${
                      isSelected || Math.max(option.votes)
                        ? "font-bold text-white"
                        : "font-medium text-[#94a3b8]"
                    }`}
                  >
                    {percent}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <section className="pt-2 sm:pt-3 flex items-center gap-0.5 sm:gap-1 text-[#64748b]">
        <span className="bg-[#1e1e3a] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs">
          {totalVote} رای
        </span>
        <Dot size={20} />
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Icon name="clock" className="w-3.5 h-3.5 sm:w-4.75 sm:h-4.75" />
          <span className="text-xs sm:text-sm">
            {duration && formatTimeLeft(duration)}
          </span>
        </div>
      </section>
    </div>
  );
};

export default PollCard;