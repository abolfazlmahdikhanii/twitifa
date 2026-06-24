import { formatPersianDate } from "@/utils/date";
import { Input, Label, TextArea } from "@heroui/react";
import Icon from "../ui/Icon/Icon";
import PersianDatePicker from "../ui/DatePicker";
import UserGender from "./UserGender";
import UserNation from "./UserNation";

const ProfileForm = (props) => {
  return (
    <section className="mt-10 grid grid-cols-2 gap-x-6.5 gap-y-6.5">
      {props.type === "personal" ? (
        <>
          {/* name */}
          <div className="flex flex-col gap-3 w-full col-span-2 sm:col-span-1">
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
                value={props.firstName}
                onChange={(e) => {
                  props.setFirstName(e.target.value);
                  props.setHasChange(true);
                }}
              />
              <Icon name="name-icon" className="input-icon" size={22}  />
            </div>
          </div>
          {/* last-name */}
          <div className="flex flex-col gap-3 w-full col-span-2 sm:col-span-1">
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
                value={props.lastName}
                onChange={(e) => {
                  props.setLastName(e.target.value);
                  props.setHasChange(true);
                }}
              />
              <Icon name="id-card" className="input-icon" size={23}  />
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
              value={props.organizationName}
              onChange={(e) => {
                props.setOrganizationName(e.target.value);
                props.setHasChange(true);
              }}
            />
              <Icon name="building" className="input-icon" size={23}  />
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
            value={props.bio}
            onChange={(e) => {
              props.setBio(e.target.value);
              props.setHasChange(true);
            }}
            maxLength={350}
          />
          <Icon name="text-document" className="textarea-icon" size={23}  />
        </div>
      </div>
      {/* location */}
      <div className="flex flex-col gap-3 w-full col-span-2 sm:col-span-1">
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
            value={props.location}
            onChange={(e) => {
              props.setLocation(e.target.value);
              props.setHasChange(true);
            }}
          />
          <Icon name="location-pin" className="input-icon" size={23} />
        </div>
      </div>

      {/* nation */}
      <UserNation
        setHasChange={props.setHasChange}
        setSelectedNation={props.setSelectedNation}
        selectedNation={props.selectedNation}
      />
      {/* birthday */}
      <div className="flex flex-col gap-3 w-full col-span-2 sm:col-span-1">
        <Label
          htmlFor="input-type-birthday"
          className="dark:text-neutral-400 text-neutral-500"
        >
          تاریخ {props.type === "personal" ? "تولد" : "تاسیس"}
        </Label>

        <div
          className="relative cursor-pointer col-span-2 sm:col-span-1"
          onClick={() => props.setIsOpenDatePicker(true)}
        >
          <Input
            id="input-type-birthday"
            placeholder="1404/01/01"
            type="text"
            className="input-lg cursor-pointer"
            readOnly
            value={formatPersianDate(props.selectedDate) || ""}
          />
          <Icon name="calendar" className="input-icon" size={23} />
        </div>

        <PersianDatePicker
          isOpen={props.isOpenDatePicker}
          setIsOpen={props.setIsOpenDatePicker}
          selectedDate={props.selectedDate}
          onDateSelect={(val) => {
            props.setSelectedDate(val);
            props.setHasChange(true);
          }}
        />
      </div>
      {/* sex */}
      {props.type === "personal" && (
        <UserGender
          gender={props.gender}
          setGender={props.setGender}
          setHasChange={props.setHasChange}
        />
      )}

      {/* job */}
      <div
        className={`flex flex-col gap-3 col-span-2 sm:col-span-1 w-full ${props.type === "personal" ? "col-span-2" : ""}`}
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
            value={props.occupation}
            onChange={(e) => {
              props.setOccupation(e.target.value);
              props.setHasChange(true);
            }}
          />
          <Icon name="briefcase" className="input-icon" size={23} />
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
            value={props.website}
            onChange={(e) => {
              props.setWebsite(e.target.value);
              props.setHasChange(true);
            }}
          />
          <Icon name="url-link" className="input-icon" size={22}  />
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
            value={props.address}
            onChange={(e) => {
              props.setAddress(e.target.value);
              props.setHasChange(true);
            }}
          />
          <Icon name="address-pin" className="textarea-icon" size={23} />
        </div>
      </div>
    </section>
  );
};

export default ProfileForm;
