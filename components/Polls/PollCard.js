"use client";
import { formatTimeLeft, getPercent } from "@/utils/post";
import { Dot } from "lucide-react";
import { useState } from "react";
import Icon from "../ui/Icon/Icon";
const options = [
  { label: "Tailwind CSS", value: "tailwind", percent: 68, selected: true },
  { label: "Bootstrap", value: "bootstrap", percent: 22, selected: false },
  { label: "Material UI", value: "material", percent: 10, selected: false },
];
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
    <div className="py-3.5">
      <div>
        <section className="pb-4.5 space-y-4.5 ">
          {options.map((option, index) => (
            <div className="relative" key={option._id}>
              <div
                className={`poll-item h-full relative overflow-hidden ${selectedVote === option._id || votedOption?._id === option._id ? "bg-[#16162D]/35" : "bg-[#1D1D34]/55"}`}
              >
                {/* {option.label} */}
                {/* Progress bar fill */}
                <div
                  className="absolute top-0 right-0 h-full rounded-r-xl transition-all duration-700 "
                  style={{
                    width: `${getPercent(option.votes, totalVote)}%`,
                    background:
                      selectedVote === option._id ||
                      votedOption?._id === option._id ||
                      Math.max(option.votes)
                        ? "#272464"
                        : "#313146",
                  }}
                />
                <div className="flex items-center justify-between relative z-10 h-full mt-0.5">
                  <div className="flex items-center gap-x-2">
                    <p
                      className={`text-base  ${selectedVote === option._id || votedOption?._id === option._id || Math.max(option.votes) ? "font-bold text-white" : "font-medium text-[#94a3b8]"}`}
                    >
                      {option.optionText}
                    </p>
                    {selectedVote === option._id ||
                    votedOption?._id === option._id ? (
                      <Icon name="check-circle" className="size-5 text-[#94a3b8]" />
                    ) : null}
                  </div>
                  <div>
                    <p
                      className={`text-sm  ${selectedVote === option._id || votedOption?._id === option._id || Math.max(option.votes) ? "font-bold text-white" : "font-medium text-[#94a3b8]"}`}
                    >
                      {getPercent(option.votes, totalVote)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
        <section className="pt-3 flex items-center justify-start gap-1 text-[#64748b] text-sm ">
          <span className="bg-[#1e1e3a] px-3 py-1.5 rounded-xl text-xs">
            {totalVote} رای
          </span>
          <Dot size={24} />
          <div className="flex items-center gap-1.5">
            <Icon name="clock" size={19} />

            <span>{duration && formatTimeLeft(duration)}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PollCard;
