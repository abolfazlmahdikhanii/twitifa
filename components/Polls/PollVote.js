"use client";
import { useAuth } from "@/context/AuthContext";
import { formatTimeLeft } from "@/utils/post";
import { Label, Radio, RadioGroup } from "@heroui/react";
import { Dot } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Icon from "../ui/Icon/Icon";

const PollVote = ({
  options,
  duration,
  votedBy,
  updatedAt,
  isUserLogin,
  totalVote,
  isOwner,
  postId,
}) => {
  const [selectedVote, setSelectedVote] = useState(options[0]?._id);
  const { user } = useAuth();

  const voteHandler = async (optionId) => {
    if (!isUserLogin && !user) {
      toast.error("برای نطرسنجی باید لاگین کنید");
      return;
    }
    if (isOwner) {
      toast.error("سازنده نظرسنجی نمیتواند در نطرسنجی شرکت کند");
      return;
    }
    if (!optionId) {
      toast.error("گزینه ای را انتخاب کنید");
      return;
    }

    try {
      const voteRes = await fetch(`/api/posts/poll/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const voteData = await voteRes.json();

      if (voteRes.status === 200) {
        toast.success("رای با موفقیت ثبت شد");
        setSelectedVote(options[0]?._id);
      } else {
        throw new Error(voteData.message || "خطا در ثبت رای");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "خطا در ثبت رای");
    }
  };

  return (
    <div className="w-full">
      {/* Options */}
      <section className="pb-3 sm:pb-4.5 space-y-3 sm:space-y-5">
        <RadioGroup
          value={selectedVote}
          onChange={setSelectedVote}
          defaultValue={options[0]?._id}
        >
          {options.map((option) => (
            <div className="relative" key={option._id}>
              <Radio
                className="poll-item h-full flex items-center bg-[#1D1D34]/55 w-full"
                value={option._id}
                onClick={() => voteHandler(option._id)}
              >
                <Radio.Control className="size-4.5 sm:size-5.5 shrink-0">
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content className="mt-0.5 sm:mt-1 min-w-0">
                  <Label className="text-sm sm:text-base truncate">
                    {option.optionText}
                  </Label>
                </Radio.Content>
              </Radio>
            </div>
          ))}
        </RadioGroup>
      </section>

      {/* Footer */}
      <section className="py-2 sm:py-4 flex items-center justify-between">
        <div className="pt-2 sm:pt-3 flex items-center gap-0.5 sm:gap-1 text-[#64748b]">
          <span className="bg-[#1e1e3a] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs">
            {totalVote} رای
          </span>
          <Dot size={20} />
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Icon name="clock" className="w-3.5 h-3.5 sm:w-4.25 sm:h-4.25" />
            <span className="text-xs sm:text-sm">
              {duration && formatTimeLeft(duration)}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PollVote;