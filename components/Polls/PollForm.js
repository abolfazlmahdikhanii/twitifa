"use client";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
} from "@heroui/react";
import { X } from "lucide-react";
import { useState } from "react";
import Icon from "../ui/Icon/Icon";

const PollForm = ({ onPollDataChange, onRemovePoll }) => {
  const durations = [
    {
      id: 1,
      title: "1 ساعت",
      value: 60,
    },
    {
      id: 2,
      title: "12 ساعت",
      value: 12 * 60,
    },
    {
      id: 3,
      title: "1 روز",
      value: 24 * 60,
    },
    {
      id: 4,
      title: "3 روز",
      value: 72 * 60,
    },
    {
      id: 5,
      title: "1 هفته",
      value: 24 * 7 * 60,
    },
  ];
  const [selectDuration, setSelectDuration] = useState(60);
  const [options, setOptions] = useState([
    { optionText: "" },
    { optionText: "" },
  ]);
  const updatePollHandler = (newOptions, newDuration) => {
    if (onPollDataChange) {
      onPollDataChange({
        options: newOptions.filter((item) => item.optionText.trim() !== ""),
        duration: newDuration,
      });
    }
  };
  const addOption = () => {
    if (options.length < 4) {
      const newOption = [...options, { optionText: "" }];
      setOptions(newOption);
      updatePollHandler(newOption, selectDuration);
    }
  };
  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((item, i) => i !== index);
      setOptions(newOptions);
      updatePollHandler(newOptions, selectDuration);
    }
  };
  const handleOptionChange = (index, val) => {
    const newOptions = [...options];
    newOptions[index] = { optionText: val };
    setOptions(newOptions);
    updatePollHandler(newOptions, selectDuration);
  };
  const handleDurationChange = (duration) => {
    setSelectDuration(duration);
    updatePollHandler(options, duration);
  };
  const handleRemovePoll = () => {
    if (onRemovePoll) {
      onRemovePoll();
      setOptions({ optionText: "" }, { optionText: "" });
      setSelectDuration(60);
    }
  };
  return (
    <Card className="bg-[#1A1A31] border border-[#34344E] mt-9 mb-8 pb-5.5 pt-7 px-9">
      <CardHeader>
        <div className="flex items-center gap-x-2.5 opacity-70">
          <Icon name="checklist" className="w-5 h-5" />

          <p className="font-semibold ">تنظیمات نظرسنجی</p>
        </div>
      </CardHeader>
      <CardContent>
        <section className="py-4.5 space-y-4.5 border-b border-b-[#34344E]">
          {options.map((option, index) => (
            <div className="relative" key={index}>
              <Input
                placeholder={`گزینه ${index + 1 > 2 ? `${index + 1} (اختیاری)` : index + 1}`}
                type="text"
                className="input-poll"
                value={option.optionText}
                onChange={(e) => {
                  handleOptionChange(index, e.target.value);
                }}
              />
              {index + 1 > 2 && (
                <Button
                  isIconOnly
                  variant="ghost"
                  className={
                    "absolute top-1/2 -translate-y-1/2 left-2 text-red-400 z-10"
                  }
                  onPress={() => removeOption(index)}
                >
                  <X />
                </Button>
              )}
            </div>
          ))}
          {options.length < 4 && (
            <Button
              variant="ghost"
              className={
                "my-1 py-5.5 px-5.5 text-[#6366F1] gap-x-2.5 font-semibold text-base [&>svg]:size-5"
              }
              onPress={addOption}
            >
              <Icon name="plus-circle" className="w-6 h-6" />
              افزودن گزینه جدید
            </Button>
          )}
        </section>
        <section className="py-5 border-b border-b-[#34344E]">
          <p className="font-semibold opacity-70">مدت زمان نظرسنجی</p>

          <div className="flex items-center gap-x-2.5 mt-4.5 pb-1.5">
            {durations.map((time) => (
              <Button
                key={time.id}
                className={` border-2 leading-3.5  ${selectDuration === time.value ? "border-transparent bg-[#4F46E5]" : "bg-[#25253B] border-[#34344E]"} px-5 py-5 `}
                onPress={() => handleDurationChange(time.value)}
              >
                {time.title}
              </Button>
            ))}
          </div>
        </section>
      </CardContent>
      <CardFooter>
        <Button
          variant="danger-soft"
          className={"mt-2 py-6.5 [&>svg]:size-5 "}
          fullWidth
          onPress={handleRemovePoll}
        >
          <Icon name="trash" className="w-6 h-6" />
          حذف نظرسنجی
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollForm;
