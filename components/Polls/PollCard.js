"use client";
import { formatTimeLeft, getPercent } from "@/utils/post";
import { Button, Description, Label, Radio, RadioGroup } from "@heroui/react";
import { Clock4, Dot } from "lucide-react";
import React, { useState } from "react";
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5 text-[#94a3b8]"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                  <div>
                    <p
                      className={`text-sm  ${selectedVote === option._id || votedOption?._id === option._id||Math.max(option.votes) ? "font-bold text-white" : "font-medium text-[#94a3b8]"}`}
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
            <Clock4 size={16} />
            <span>{duration && formatTimeLeft(duration)}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PollCard;
