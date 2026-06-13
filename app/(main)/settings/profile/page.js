"use client";
import AccountType from "@/components/ui/main/AccountType";
import {
  Avatar,
  Button,
  Input,
  Label,
  Select,
  ListBox,
  TextArea,
  ScrollShadow,
  Autocomplete,
  SearchField,
  useFilter,
  AvatarImage,
  AvatarFallback,
  Spinner,
} from "@heroui/react";
import {
  ArrowBigLeft,
  ArrowLeft,
  BriefcaseBusiness,
  Building,
  Building2,
  Calendar,
  Camera,
  Earth,
  FileText,
  IdCard,
  Link2,
  MapPin,
  MapPinHouse,
  Save,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import React, { Activity, useEffect, useState } from "react";
import countryFlagEmoji from "country-flag-emoji";
import DatePicker from "@/components/ui/DatePicker";
import PersianDatePicker from "@/components/ui/DatePicker";
import { formatPersianDate } from "@/utils/date";
import userProfileSchema from "@/validators/profile";
import z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/components/ui/PageHeader/PageHeader";

const ProfileSettingPage = () => {
  const { user, refetch } = useAuth();
  const [hasChange, setHasChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("personal");
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedNation, setSelectedNation] = useState("IR");
  const [location, setLocation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [bio, setBio] = useState("");
  const [occupation, setOccupation] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const { contains } = useFilter({ sensitivity: "base" });

  useEffect(() => {
    if (user) {
      setType(user.accountType || "personal");
      setSelectedDate(user.birthDate || null);
      setSelectedNation(user.nationality || "IR");
      setLocation(user.location || "");
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setOrganizationName(user.organizationName || "");
      setBio(user.bio || "");
      setOccupation(user.occupation || "");
      setWebsite(user.website || "");
      setAddress(user.address || "");
      setGender(user.gender || "");
    }
  }, [user]);

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(selectedDate);
      setIsLoading(true);
      const userInfo = {
        accountType: type,
        bio,
        location,
        occupation,
        website,
        address,
        gender,
        birthDate: selectedDate,
        nationality: selectedNation,
      };

      if (type === "personal") {
        userInfo.firstName = firstName;
        userInfo.lastName = lastName;
      } else {
        userInfo.organizationName = organizationName;
      }

      const isValid = userProfileSchema.safeParse(userInfo);
      if (!isValid.success) {
        const zodError = z.flattenError(isValid.error);
        Object.entries(zodError.fieldErrors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(message);
          });
        });
        return;
      }

      // post data
      const infoRes = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });
      if (infoRes.status === 201) {
        toast.success("اطلاعات با موفقیت بروزرسانی شد");
        setIsLoading(false);
        setHasChange(false);
        // refetch();
      } else {
        const errorData = await infoRes.json();
        setIsLoading(false);
        throw new Error(errorData.message || "خطا در بروزرسانی اطلاعات");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "خطا در بروزرسانی اطلاعات");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader />
      <ScrollShadow className="max-h-[79vh]" hideScrollBar>
        <main className="w-[88%] mx-auto">
          <div>
            {/* avatar */}
            <div className="relative mt-8">
              <div className="h-62 ">
                <Image
                  src={"/images/profile-bg.webp"}
                  alt="profile-bg"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <Button
                className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-5.5 py-5.5 opacity-80"
                variant="tertiary"
              >
                <Camera className="size-5 ml-1" /> تغییر عکس نمایه
              </Button>
            </div>
            <div className="relative ">
              <div className="absolute -top-6 -translate-y-1/2 right-16 flex flex-row-reverse items-center ">
                <Avatar className="w-36 h-36 ">
                  <Avatar.Image
                    alt="Blue"
                    src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                  />
                  <Avatar.Fallback className="text-2xl">B</Avatar.Fallback>
                </Avatar>
                <Button
                  className="absolute bottom-0.5 right-0.5 w-12 h-12 flex items-center justify-center rounded-full"
                  variant="primary"
                >
                  <Camera className="size-5" />
                </Button>
              </div>
            </div>
          </div>
          {/* account Type */}
          <div className="mt-26 ">
            <AccountType
              setType={(type) => {
                setType(type);
                setHasChange(true);
              }}
              defaultType={type || user?.accountType}
            />
          </div>
          <section className="mt-10 grid grid-cols-2 gap-x-6.5 gap-y-6.5">
            {type === "personal" ? (
              <>
                {/* name */}
                <div className="flex flex-col gap-3 w-full">
                  <Label
                    htmlFor="input-type-name"
                    className="dark:text-neutral-400 text-neutral-500"
                  >
                    نام
                  </Label>
                  <div className="relative">
                    <Input
                      id="input-type-name"
                      placeholder="نام خود را وارد کنید"
                      type="text"
                      className="input-lg"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setHasChange(true);
                      }}
                    />
                    <User size={23} className="input-icon" />
                  </div>
                </div>
                {/* last-name */}
                <div className="flex flex-col gap-3 w-full">
                  <Label
                    htmlFor="input-type-lastname"
                    className="dark:text-neutral-400 text-neutral-500"
                  >
                    نام خانوادگی
                  </Label>
                  <div className="relative">
                    <Input
                      id="input-type-lastname"
                      placeholder="نام خانوادگی خود را وارد کنید"
                      type="text"
                      className="input-lg"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setHasChange(true);
                      }}
                    />
                    <IdCard size={23} className="input-icon" />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 w-full col-span-2">
                <Label
                  htmlFor="input-type-username"
                  className="dark:text-neutral-400 text-neutral-500"
                >
                  نام سازمان
                </Label>
                <div className="relative">
                  <Input
                    id="input-type-name"
                    placeholder="نام رسمی ثبت شده سازمان با برند"
                    type="text"
                    className="input-lg"
                    value={organizationName}
                    onChange={(e) => {
                      setOrganizationName(e.target.value);
                      setHasChange(true);
                    }}
                  />
                  <Building size={23} className="input-icon" />
                </div>
              </div>
            )}
            {/* bio */}
            <div className="flex flex-col gap-3 w-full col-span-2">
              <Label
                htmlFor="input-type-bio"
                className="dark:text-neutral-400 text-neutral-500"
              >
                درباره من
              </Label>
              <div className="relative">
                <TextArea
                  id="input-type-bio"
                  placeholder="کمی درباره خودتان بنویسید ..."
                  className="input-lg resize-none min-h-36 py-4.5 "
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    setHasChange(true);
                  }}
                  maxLength={350}
                />
                <FileText size={23} className="textarea-icon " />
              </div>
            </div>
            {/* location */}
            <div className="flex flex-col gap-3 w-full">
              <Label
                htmlFor="input-type-location"
                className="dark:text-neutral-400 text-neutral-500"
              >
                موقعیت مکانی
              </Label>
              <div className="relative">
                <Input
                  id="input-type-location"
                  placeholder="تهران، ایران"
                  type="text"
                  className="input-lg"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setHasChange(true);
                  }}
                />
                <MapPin size={23} className="input-icon" />
              </div>
            </div>

            <Autocomplete
              className="w-full text-right h-full flex flex-col gap-3 "
              placeholder="گزینه را انتخاب کنید"
              dir="rtl"
              selectionMode="single"
              defaultValue={"IR"}
              value={selectedNation}
              onChange={(value) => {
                setSelectedNation(value);
                setHasChange(true);
              }}
            >
              <Label className="dark:text-neutral-400 text-neutral-500">
                ملیت
              </Label>
              <Autocomplete.Trigger className="input-lg flex items-center justify-between text-right">
                <Autocomplete.Value
                  className={"text-right  text-[15px] flex items-center gap-1"}
                >
                  <span>{countryFlagEmoji.get(selectedNation)?.name}</span>
                </Autocomplete.Value>
                <Earth size={23} className="input-icon" />
              </Autocomplete.Trigger>
              <Autocomplete.Popover
                className={"bg-[#191933] border border-[#34344E] relative "}
              >
                <Autocomplete.Filter filter={contains}>
                  <SearchField
                    autoFocus
                    name="search"
                    className={"sticky -top-2 pt-3 z-10 bg-[#191933]"}
                  >
                    <SearchField.Group className="input-lg h-11! mb-1">
                      <SearchField.SearchIcon />
                      <SearchField.Input placeholder="جستجو کردن..." />
                      <SearchField.ClearButton />
                    </SearchField.Group>
                  </SearchField>
                  <ListBox variant="danger">
                    {countryFlagEmoji?.list.map((item) => (
                      <ListBox.Item
                        key={item.code}
                        id={item.code}
                        textValue={item.name}
                        className="hover:bg-[#34344E] transition-all duration-75 h-12 flex items-center gap-3 pr-3"
                      >
                        <div className=" text-3xl">{item.emoji}</div>
                        <div className="flex flex-col">
                          <Label className="text-[15px]">{item.name}</Label>
                        </div>
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Autocomplete.Filter>
              </Autocomplete.Popover>
            </Autocomplete>
            {/* birthday */}
            <div className="flex flex-col gap-3 w-full">
              <Label
                htmlFor="input-type-birthday"
                className="dark:text-neutral-400 text-neutral-500"
              >
                تاریخ {type === "personal" ? "تولد" : "تاسیس"}
              </Label>

              <div
                className="relative cursor-pointer"
                onClick={() => setIsOpenDatePicker(true)}
              >
                <Input
                  id="input-type-birthday"
                  placeholder="1404/01/01"
                  type="text"
                  className="input-lg cursor-pointer"
                  readOnly
                  value={formatPersianDate(selectedDate) || ""}
                />
                <Calendar size={23} className="input-icon" />
              </div>

              <PersianDatePicker
                isOpen={isOpenDatePicker}
                setIsOpen={setIsOpenDatePicker}
                selectedDate={selectedDate}
                onDateSelect={(val) => {
                  setSelectedDate(val);
                  setHasChange(true);
                }}
              />
            </div>
            {/* sex */}
            {type === "personal" && (
              <Select
                className="w-full text-right h-full flex flex-col gap-3 "
                placeholder="گزینه را انتخاب کنید"
                dir="rtl"
                onChange={(value) => {
                  setGender(value);
                  setHasChange(true);
                }}
                value={gender}
              >
                <Label className="dark:text-neutral-400 text-neutral-500">
                  جنسیت
                </Label>
                <Select.Trigger className="input-lg flex items-center justify-between text-right">
                  <Select.Value className={"text-right text-[15px]"} />
                  <Users size={23} className="input-icon" />
                </Select.Trigger>
                <Select.Popover
                  className={"bg-[#191933] border border-[#34344E] "}
                >
                  <ListBox>
                    <ListBox.Item
                      id="man"
                      textValue="man"
                      className="hover:bg-[#34344E] h-10"
                    >
                      مرد
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item
                      id="woman"
                      textValue="woman"
                      className="hover:bg-[#34344E] h-10"
                    >
                      زن
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            )}

            {/* job */}
            <div
              className={`flex flex-col gap-3 w-full ${type === "personal" ? "col-span-2" : ""}`}
            >
              <Label
                htmlFor="input-type-job"
                className="dark:text-neutral-400 text-neutral-500"
              >
                شغل/حوزه فعالیت
              </Label>
              <div className="relative">
                <Input
                  id="input-type-job"
                  placeholder="توسعه دهنده نرم افزار، دیجیتال مارکتینگ و ..."
                  type="text"
                  className="input-lg"
                  value={occupation}
                  onChange={(e) => {
                    setOccupation(e.target.value);
                    setHasChange(true);
                  }}
                />
                <BriefcaseBusiness size={23} className="input-icon" />
              </div>
            </div>
            {/* site */}
            <div className="flex flex-col gap-3 w-full col-span-2">
              <Label
                htmlFor="input-type-website"
                className="dark:text-neutral-400 text-neutral-500"
              >
                وبسایت
              </Label>
              <div className="relative">
                <Input
                  id="input-type-website"
                  placeholder="https://yoursite.com"
                  type="text"
                  className="input-lg leading-8.5 "
                  dir="ltr"
                  value={website}
                  onChange={(e) => {
                    setWebsite(e.target.value);
                    setHasChange(true);
                  }}
                />
                <Link2 size={23} className="input-icon " />
              </div>
            </div>
            {/* address */}
            <div className="flex flex-col gap-3 w-full col-span-2">
              <Label
                htmlFor="input-type-website"
                className="dark:text-neutral-400 text-neutral-500"
              >
                آدرس دقیق
              </Label>
              <div className="relative">
                <TextArea
                  id="input-type-website"
                  placeholder="نشانی محل سکونت یا دفتر مرکزی سازمان"
                  className="input-lg resize-none min-h-30 py-4.5 "
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setHasChange(true);
                  }}
                />
                <MapPinHouse size={23} className="textarea-icon " />
              </div>
            </div>
          </section>
        </main>
      </ScrollShadow>
      <div className="flex justify-end py-4 mt-4 border-t border-t-[#34344E] px-13">
        <Button
          size="lg"
          className={"h-13 py-3 text-lg font-bold px-10"}
          isDisabled={!hasChange || isLoading}
          onClick={updateProfileHandler}
        >
          ذخیره تغییرات{" "}
          {isLoading ? (
            <Spinner color="current" className="mr-1" />
          ) : (
            <Save size={30} className="mr-1" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettingPage;
