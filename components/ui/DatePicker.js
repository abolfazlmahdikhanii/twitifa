"use client";

import React, { useState } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { Button, Modal, Separator } from "@heroui/react";

export default function PersianDatePicker({
  isOpen,
  setIsOpen,
  onDateSelect,
  dateSelected,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [value, setValue] = useState(
    dateSelected
      ? new DateObject({
          date: new Date(dateSelected),
          calendar: persian,
          locale: persian_fa,
        })
      : new DateObject({ calendar: persian, locale: persian_fa }),
  );
const yesterday = new DateObject({
  calendar: persian,
  locale: persian_fa,
}).subtract(1, "day");
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setValue(date);

    const gregorianDate = date.toDate(); // JS Date
    const isoString = gregorianDate.toISOString();

    onDateSelect(isoString);

    setIsOpen(false);
  };

  const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

  const changeMonth = (increment) => {
    const newDate = new DateObject(value);
    newDate.month = newDate.month + increment;
    setValue(newDate);
  };

  const changeYear = (increment) => {
    const newDate = new DateObject(value);
    newDate.year = newDate.year + increment;
    setValue(newDate);
  };

  const resetToToday = () => {
    const today = new DateObject({ calendar: persian, locale: persian_fa });
    setSelectedDate(today);
    setValue(today);
  };

  // Get Gregorian month name
  const getGregorianMonth = () => {
    const gregorianDate = value.toDate();
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(gregorianDate);
  };

  return (
    <>
      <Modal isOpen={isOpen} >
        <Modal.Backdrop variant="blur" isDismissable>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-lg bg-[#1E1E2E] border border-[#34344E] p-0">
              <Modal.Header>
                <div className=" py-4 border-b border-[#34344E] relative flex items-center justify-between px-6">
                  <Button
                    isIconOnly
                    onClick={resetToToday}
                    size="lg"
                    variant="outline"
                    className={
                      "rounded-xl border-[#34344E] text-slate-400 hover:bg-gray-700 px-4"
                    }
                  >
                    <RefreshCcw size={24} />
                  </Button>
                  <Modal.Heading className="text-xl font-bold self-center justify-self-center text-center w-full">
                    انتخاب زمان
                  </Modal.Heading>
                </div>
              </Modal.Header>

              <Modal.Body className="px-2 pb-2   ">
                <div className="p-6 relative" dir="rtl">
                  {/* Year and Month Selectors */}
                  <div className="flex items-center gap-4 mb-6 ">
                    {/* Month Selector */}
                    <div className="flex items-center gap-2 bg-transparent border border-[#34344E] rounded-lg px-3 py-3 h-14  justify-between w-full">
                      <Button
                        isIconOnly
                        variant="tertiary"
                        size="sm"
                        onClick={() => changeMonth(-1)}
                        className={"bg-[#34344E]"}
                      >
                        <ChevronRight />
                      </Button>
                      <span className="text-slate-300 text-base font-bold">
                        {value.month.name}
                      </span>
                      <Button
                        isIconOnly
                        variant="tertiary"
                        size="sm"
                        onClick={() => changeMonth(1)}
                        className={"bg-[#34344E]"}
                      >
                        <ChevronLeft />
                      </Button>
                    </div>
                    <Separator
                      orientation="vertical"
                      className="mx-2 bg-[#34344E] h-9"
                    />
                    {/* Year Selector */}
                    <div className="flex items-center gap-2 bg-transparent border border-[#34344E] rounded-lg px-3 py-3 h-14  justify-between w-full">
                      <Button
                        isIconOnly
                        variant="tertiary"
                        size="sm"
                        onClick={() => changeYear(-1)}
                        className={"bg-[#34344E]"}
                      >
                        <ChevronRight />
                      </Button>
                      <span className="font-bold text-base text-slate-300 mt-2">
                        {value.year}
                      </span>
                      <Button
                        isIconOnly
                        variant="tertiary"
                        size="sm"
                        onClick={() => changeYear(1)}
                        className={"bg-[#34344E]"}
                      >
                        <ChevronLeft />
                      </Button>
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="custom-calendar">
                    <Calendar
                      value={value}
                      onChange={handleDateChange}
                      calendar={persian}
                      locale={persian_fa}
                      weekDays={weekDays}
                      onMonthChange={setValue}
                      maxDate={yesterday}
                    />
                  </div>
                </div>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
