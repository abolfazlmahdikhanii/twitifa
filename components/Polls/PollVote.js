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
      const newVote = {
        optionId,
      };

      const voteRes = await fetch(`/api/posts/poll/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVote),
      });
      const voteData = await voteRes.json();

      if (voteRes.status === 200) {
        toast.success(" رای با موفقیت ثبت شد");
        // reset form
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
    <div>
      <div>
        <section className="pb-4.5 space-y-5 ">
          <RadioGroup
            value={selectedVote}
            onChange={setSelectedVote}
            defaultValue={options[0]?._id}
          >
            {options.map((option, index) => (
              <div className="relative" key={option._id}>
                <Radio
                  className={
                    "poll-item h-full flex items-center bg-[#1D1D34]/55"
                  }
                  value={option._id}
                  onClick={() => voteHandler(option._id)}
                >
                  {/* {option.label} */}
                  <Radio.Control className="size-5.5">
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content className="mt-1">
                    <Label className="text-base">{option.optionText}</Label>
                  </Radio.Content>
                </Radio>
              </div>
            ))}
          </RadioGroup>
        </section>
        <section className="py-4 flex items-center justify-between">
          <section className="pt-3 flex items-center justify-start gap-1 text-[#64748b] text-sm ">
            <span className="bg-[#1e1e3a] px-3 py-1.5 rounded-xl text-xs">
              {totalVote} رای
            </span>
            <Dot size={24} />
            <div className="flex items-center gap-1.5">
              <Icon name="clock" className="w-4.25 h-4.25" />
              <span>{duration && formatTimeLeft(duration)}</span>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default PollVote;
